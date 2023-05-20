# Imports 
import PyTorch_lightning as pl
import math as maths
import torch as pt
from torch import nn
from torch.nn import functional as F
from torch.utils.data import random_split, DataLoader
from torchvision import datasets, transforms
from torchvision.datasets import ImageFolder

# dataLoader provider
class idDataModel(pl.LightningDataModule):
    # Constructor
    def __init__(self, data_dir, batchSize, ):
        super().__init__()
        self.dataDir = data_dir
        self.batchSize = batchSize
        self.transform = transforms.Compose([
            transforms.Grayscale(num_output_channels=1),
            transforms.center_crop(224),
            transforms.adjust_contrast(contrast_factor=2),
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
            id_dataset = ImageFolder(self.dataDir, train = True,  transform=self.transform)
            self.id_train, self.id_val = random_split(id_dataset, [int(len(id_dataset)*0.8), int(len(id_dataset)*0.2)])

        # Assign test dataset for use in dataloaders
        if stage == 'test' or stage is None:
            self.id_test = ImageFolder(self.dataDir, transform=self.transform)
    
    # functions to return dataLoader modules.
    def train_dataloader(self):
        return DataLoader(self.id_train, batchSize=self.batchSize, shuffle=True)
    
    def val_dataloader(self):
        return DataLoader(self.id_val, batchSize=self.batchSize)
    
    def test_dataloader(self):
        return DataLoader(self.id_test, batchSize=self.batchSize)
    
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
        self.fc1 = nn.Linear(512*13*13, 128)
        self.batchNorm6 = nn.BatchNorm1d(128)

        ## Layer 7 (output layer)
        numOfConstellations = 10
        self.fc2 = nn.Linear(128, numOfConstellations)
        self.batchNorm7 = nn.BatchNorm1d(10)

        # activation functions
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)
        

    