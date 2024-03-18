import torch
import torch.nn as nn
import torch.nn.functional as F


class MixingDetector(nn.Module):
    def __init__(self, input_layer: int):
        super().__init__()
        self.fc1 = nn.Linear(input_layer, 32)
        self.fc2 = nn.Linear(32, 32)
        self.fc3 = nn.Linear(32, 8)
        self.fc4 = nn.Linear(8, 1)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = F.relu(self.fc3(x))
        x = torch.sigmoid(self.fc4(x))
        return x
