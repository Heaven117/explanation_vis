from flask import Flask
from flask import request, jsonify, redirect
import json
from flask import render_template
import torch
from waitress import serve
import numpy as np
import pandas as pd
from svm.run_model import load_model
from svm.data_process import loader_data
from process import find_anchors,anchors_tabular
from utils import toJson,get_default_config

np.random.seed(12345)
model_config = get_default_config()[0]
save_path = model_config['save_path']
device = model_config['device']

# ------- Initialize file ------- #
BASEDIR = './server/data/'
# 原始数据
data_file = BASEDIR+'final_data_file.csv'
pre_file = BASEDIR+'pre_data.csv'
raw_data = pd.read_csv(data_file, header=None).values
pre_data = pd.read_csv(pre_file, header=0).values

# 影响函数
with open(BASEDIR + 'influence.json','r',encoding = 'utf-8') as fp:
    influenceData = json.load(fp)
    print('=====influence file read done')
fp.close()

# 加载训练好的模型
model = load_model(BASEDIR+'svm_FICO_500.pth')
train_loader,test_loader,train_set,test_set= loader_data()



# ------ Initialize WebApp ------- #
app = Flask(__name__)

@app.route('/getInstance')
def getInstance():
    idx = -10
    raw_data_len = len(raw_data)
    try:
        idx = int(request.args.get('params'))
    except:
        return f"Please enter a sample number in the range (1, ${raw_data_len})."
    
    if idx<0 or idx>raw_data_len:
        return f"Please enter a sample number in the range (1, ${raw_data_len})."
    else:			
        sample = raw_data[idx]

        #! anchor 算法
        # anchor = find_anchors(model, train_loader, idx, 100)
        anchors = anchors_tabular(model,idx,train_set,test_set)

        response = {}
        response['id'] = idx
        response['total'] = len(raw_data)
        response['sample'] = sample
        response['anchor'] = anchors
        response['predict'] = pre_data[idx]
        return toJson(response)

# 获取相似数据-影响训练点
@app.route('/getSimilarData')
def getSimilarData():
    idx = request.args['params']
    total = influenceData['total']
    inData = influenceData[str(idx)]
    time = inData['time_calc_influence_s']
    influence = inData['influence']
    harmful=inData['harmful']
    helpful = inData['helpful']

    response = {}
    response['total'] = total
    response['time'] = time
    response['harmful'] = []
    response['helpful'] = []
    for i in range(len(harmful)):
        response['harmful'].append({
            'id': harmful[i],
            'value': influence[harmful[i]],
        })
        response['helpful'].append({
            'id': helpful[i],
            'value': influence[helpful[i]],
        })
    return toJson(response)

@app.route('/getPredData')
def getPredData():
    return toJson(pre_data[:100])

@app.route('/getDataLength')
def getDataLength():
    return toJson(len(raw_data))

@app.route('/runModel',methods=['GET', 'POST'])
def runModel():
    if request.method == 'POST':
        print(request.json)
        test_set = request.json
        model = load_model(save_path)
        x_test = torch.Tensor(test_set).to(device)
        y = model.pred(x_test).item()
        y_prob = model(x_test).item()
        print("Test result:\t{:.2%}\t{:.2%}".format(y,y_prob))

        response = {}
        response['predict'] = y
        response['possible'] = y_prob
        return toJson(response)


# ------- Run WebApp ------- #

if __name__ == '__main__':
    # app.run(port=3001, host="0.0.0.0", debug=True)
    serve(app, host="0.0.0.0",port=3001)