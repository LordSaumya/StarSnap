# Imports 
import pytorch_lightning as pl
import math as maths
import torch as pt
from torch import nn
from torch.nn import functional as F
from torch.utils.data import random_split, DataLoader
import torchmetrics as tm
from torchvision import transforms
from pytorch_lightning import loggers as pl_loggers
from torchvision.datasets import ImageFolder
from PIL import Image
import matplotlib.pyplot as plt
import io

# dataLoader provider
class idDataLoader(pl.LightningDataModule):
    # Constructor
    def __init__(self, data_dir, batch_size):
        super().__init__()
        self.dataDir = data_dir
        self.batch_size = batch_size
        self.transform = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.RandomRotation(degrees=180),
            transforms.Resize((224, 224)),
            transforms.ColorJitter(brightness=0, contrast=2.0, saturation=0, hue=0),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])

    # Download Data
    def prepare_data(self):
        # download
        ImageFolder(self.dataDir, transform=self.transform)

    # Assign datasets based on stage.
    def setup(self, stage=None):
        # Assign train/val datasets for use in dataloaders
        if stage == 'fit' or stage is None:
            id_dataset = ImageFolder(self.dataDir, transform=self.transform)
            self.id_train, self.id_val = random_split(id_dataset, [round(len(id_dataset) * 0.8), len(id_dataset) - round(len(id_dataset) * 0.8)])

        # Assign test dataset for use in dataloaders
        if stage == 'test' or stage is None:
            self.id_test = ImageFolder(self.dataDir, transform=self.transform)

    # functions to return dataLoader modules.
    def train_dataloader(self):
        return DataLoader(self.id_train, batch_size=self.batch_size, shuffle=True)

    def val_dataloader(self):
        return DataLoader(self.id_val, batch_size=self.batch_size)

    def test_dataloader(self):
        return DataLoader(self.id_test, batch_size=self.batch_size)
    
# Model
class idModel(pl.LightningModule):
    def __init__(self, inputShape, numClasses, lr, batchSize):
        super().__init__()

        # define and save hpams
        self.save_hyperparameters()
        self.inputShape = inputShape
        self.numClasses = numClasses
        self.lr = lr
        self.batchSize = batchSize
        self.loss = nn.CrossEntropyLoss()
        self.maxPool = nn.MaxPool2d(2, 2)

        self.validation_preds = []
        self.validation_targets = []

        # model architecture

        ## Layer 1 (input layer)
        self.conv1 = nn.Conv2d(1, 32, 3, 1)
        self.batchNorm1 = nn.BatchNorm2d(32)

        ## Layer 2
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.batchNorm2 = nn.BatchNorm2d(64)

        ## Layer 3
        self.conv3 = nn.Conv2d(64, 128, 3, 1)
        self.batchNorm3 = nn.BatchNorm2d(128)

        ## Layer 4
        self.conv4 = nn.Conv2d(128, 256, 3, 1)
        self.batchNorm4 = nn.BatchNorm2d(256)

        ## Layer 5
        self.conv5 = nn.Conv2d(256, 512, 3, 1)
        self.batchNorm5 = nn.BatchNorm2d(512)

        ## Layer 6 (reduces to 128 features)
        self.fc1 = nn.Linear(294912, 128)

        ## Layer 7 (output layer)
        numOfConstellations = 4
        self.fc2 = nn.Linear(128, numOfConstellations)

        # activation functions
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)
        self.dropout = nn.Dropout(0.5)

        # accuracy function
        self.accuracy = tm.Accuracy(task = "multiclass", num_classes = numOfConstellations)

    # forward prop
    def forward(self, x):
      # Layer 1 (input layer)
      x = self.conv1(x)
      x = self.batchNorm1(x)
      x = self.relu(x)
      x = self.maxPool(x)
      x = self.dropout(x)

      # Layer 2
      x = self.conv2(x)
      x = self.batchNorm2(x)
      x = self.relu(x)

      # Layer 3
      x = self.conv3(x)
      x = self.batchNorm3(x)
      x = self.relu(x)
      x = self.maxPool(x)
      x = self.dropout(x)

      # Layer 4
      x = self.conv4(x)
      x = self.batchNorm4(x)
      x = self.relu(x)

      # Layer 5
      x = self.conv5(x)
      x = self.batchNorm5(x)
      x = self.relu(x)
      x = self.maxPool(x)
      x = self.dropout(x)

      # Layer 6
      x = pt.flatten(x, 1) # reduces tensor dimension to 1D
      x = self.fc1(x)
      x = self.relu(x)

      # Layer 7 (output layer)
      x = self.fc2(x)
      x = self.softmax(x) # returns probabilities for each constellation

      return x


    # Training step
    def training_step(self, batch, batch_idx):
        inputImage, label = batch
        logits = self(inputImage) # get predictions
        loss = F.nll_loss(logits, label) # calculate loss using negative log

        prediction = pt.argmax(logits, dim=1) # get prediction with max probability
        accuracy = self.accuracy(prediction, label) # calculate accuracy

        # Log metrics
        self.log('trainingLoss', loss, on_step = True, on_epoch = True, logger = True)
        self.log('trainingAccuracy', accuracy, on_step = True, on_epoch = True, logger = True)

        return loss

    # Validation step
    def validation_step(self, batch, batch_idx):
        # Same as training step except for logging method
        inputImage, label = batch
        logits = self(inputImage)
        loss = F.nll_loss(logits, label)

        prediction = pt.argmax(logits, dim=1)
        accuracy = self.accuracy(prediction, label)

        # Save the predictions and targets as instance attributes
        self.validation_preds.append(prediction)
        self.validation_targets.append(label)

        # Log metrics
        self.log('validationLoss', loss, prog_bar = True, logger = True)
        self.log('validationAccuracy', accuracy, prog_bar = True, logger = True)

        return loss

    # Test step
    def test_step(self, batch, batch_idx):
        # Same as training step except for logging method
        inputImage, label = batch
        logits = self(inputImage)
        loss = F.nll_loss(logits, label)

        prediction = pt.argmax(logits, dim=1)
        accuracy = self.accuracy(prediction, label)

        # Log metrics
        self.log('testLoss', loss, prog_bar = True, logger = True)
        self.log('testAccuracy', accuracy, prog_bar = True, logger = True)

        return loss

    def on_validation_epoch_end(self):
      # Get the predictions and targets from the validation step
      preds = pt.cat(self.validation_preds)
      targets = pt.cat(self.validation_targets)

      # Reset validation variables
      self.validation_preds = []
      self.validation_targets = []

      # Calculate the confusion matrix
      confmat = tm.functional.confusion_matrix(preds, targets, num_classes = self.numClasses, task = "multiclass")

      # Log the confusion matrix to TensorBoard
      self.logger.experiment.add_image('Confusion Matrix', plot_confusion_matrix(confmat))

      # Calculate and log a histogram to TensorBoard
      self.logger.experiment.add_histogram('Histogram', preds)

    # Configure optimisers
    def configure_optimizers(self):
        optimiser = pt.optim.Adam(self.parameters(), lr=self.lr) # Adaptive Moment Estimation (Adam) optimiser
        scheduler = pt.optim.lr_scheduler.StepLR(optimiser, step_size=10, gamma=0.1)
        return [optimiser], [scheduler]

# TensorBoard Visualisation
def plot_confusion_matrix(confmat):

    confmat = confmat.cpu()
    
    # Plot the confusion matrix using matplotlib
    fig, ax = plt.subplots()
    ax.matshow(confmat, cmap=plt.cm.Blues)
    ax.set_xlabel('Predicted label')
    ax.set_ylabel('True label')

    # Convert the plot to a PIL image
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    image = Image.open(buf)

    # Convert the PIL image to a PyTorch tensor
    image = transforms.ToTensor()(image)

    return image

# Data directory path
dataDirPath = "/images"

# Training
tensorboard = pl_loggers.TensorBoardLogger(save_dir="")
trainer = pl.Trainer(logger = tensorboard)
model = idModel((1,224,224), 4, 1e-3, 5)
dataLoader = idDataLoader(dataDirPath, 5)

# Main function
if __name__ == '__main__':
    trainer.fit(model, datamodule=dataLoader)
    trainer.validate(model, datamodule=dataLoader)
    pt.save(model.state_dict(), 'checkpoint.pth')