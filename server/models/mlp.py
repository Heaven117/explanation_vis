import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
# from torch.utils.tensorboard import SummaryWriter
import csv

import sys
import os
sys.path.append(os.curdir)

from server.utils.parser import *
from server.utils.helper import display_progress
from server.models.data_process import *

import warnings
warnings.filterwarnings("ignore")  # 忽略UserWarning兼容性警告

args = parse_args()
device = args.device

class MLP(nn.Module) :
    def __init__(self) :
        super(MLP, self).__init__()
        self.net = nn.Sequential(nn.Linear(102, 64), 
                                nn.ReLU(), 
                                nn.Linear(64, 32), 
                                nn.ReLU(),
                                nn.Linear(32, 2)
                                )
    def forward(self, x) :
        out = self.net(x) 
        return F.softmax(out)
    
    def predict_single(self,x):
        out = self.forward(x)
        _, pred = torch.max(out,dim = 0)
        return pred.item()
    
    def predict_anchor(self,x,encoder):
        x = encoder_process(x,encoder)
        x = normalize(x,axis = 0,norm = 'max')
        x = torch.from_numpy(x)
        out = self.forward(x)
        _, pred = torch.max(out,dim = 1)
        return pred.numpy()
      

def load_model():
    best_model = MLP().to(device)
    ckpt = torch.load(args.data_path+args.dataset+f'/MPL_{args.epoch}.pth', map_location='cpu')
    best_model.load_state_dict(ckpt)
    return best_model



    
    


