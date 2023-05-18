# Imports

import PyTorch_lightning as pl;
import math as maths;
import torch as pt;
from torch import nn;
from torch.nn import functional as F;
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

        # Assign test dataset for use in dataloader(s)
        if stage == 'test' or stage is None:
            self.id_test = ImageFolder(self.dataDir, transform=self.transform)
    
    def train_dataloader(self):
        return DataLoader(self.id_train, batchSize=self.batchSize, shuffle=True)
    
    def val_dataloader(self):
        return DataLoader(self.id_val, batchSize=self.batchSize)
    
    def test_dataloader(self):
        return DataLoader(self.id_test, batchSize=self.batchSize)
    