import torch.nn as nn
import torch.nn.functional as F
from torch.optim import Adam

import lightning as L


class ChangeDetector(L.LightningModule):
    def __init__(self, input_size, lr=0.05):
        super().__init__()
        self.fc1 = nn.Linear(input_size, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 32)
        self.fc4 = nn.Linear(32, 16)
        self.fc5 = nn.Linear(16, 2)
        self.fc6 = nn.Linear(2, 1)
        self.loss = nn.BCELoss()
        self.lr = lr

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = F.relu(self.fc4(x))
        x = F.relu(self.fc5(x))
        x = self.fc6(x)

    def configure_optimizers(self):
        return Adam(self.parameters, self.lr)

    def training_step(self, batch, batch_idx):
        input_i, label_i = batch
        output_i = self.forward(input_i)
        loss = self.loss(output_i, label_i)
        return loss
