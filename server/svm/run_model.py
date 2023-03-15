import torch
import torch.optim as optim

import os
import sys
sys.path.append(os.curdir)

from utils import *
from svm.SVM_model import SVM
from svm.data_process import loader_data

model_config = get_default_config()[0]
save_path = model_config['save_path']
device = model_config['device']
lr = model_config['lr']
c = model_config['c']
EPOCH = model_config['epoch']

def save_model(model):
    torch.save(model.state_dict(), save_path)

def load_model(save_path):
    model = SVM().to(device)
    model.load_state_dict(torch.load(save_path))
    model.to(device)
    return model

def criterion(y,output,weight):
    # loss = torch.mean(torch.clamp(1 - y * output, min=0))
    # loss += c * (weight.t() @ weight) / 2.0
    # return loss

    loss = 1-y * output
    loss[loss<=0] = 0
    return torch.sum(loss)


def test(train_set,test_set):
    model = load_model(save_path)
    # train dataset
    x_train = train_set.tensor_data['X'].to(device)
    y_train = train_set.tensor_data['Y'].to(device).squeeze()

    y_pred_train = model.batch_pred(x_train)
    train_correct = (y_pred_train == y_train).sum().item()
    acc_train = train_correct / x_train.shape[0]

    # test dataset
    x_test = test_set.tensor_data['X'].to(device)
    y_test = test_set.tensor_data['Y'].to(device).squeeze()

    y_pred_train = model.batch_pred(x_test)
    acc_test = (y_pred_train == y_test).sum().item() / x_test.shape[0]

    print("Train Accuracy:\t{:.2%}".format(acc_train))
    print("Test Accuracy:\t{:.2%}".format(acc_test))
    for name,param in model.named_parameters():
        print(name, param)



if __name__ == "__main__":
    train_loader,test_loader,train_set,test_set= loader_data()

    print("=====================train model done.")
    test(train_set,test_set)
   
