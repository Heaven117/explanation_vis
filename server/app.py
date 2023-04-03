from flask import Flask
from flask import request, jsonify, redirect
import json
from flask import render_template
import torch
from waitress import serve
import numpy as np
import pandas as pd
import copy

from utils.helper import *
from models.mlp import load_model
import warnings
warnings.filterwarnings("ignore")  # 忽略UserWarning兼容性警告

np.random.seed(12345)

# ------- Initialize file ------- #
BASEDIR = './server/data/adult/'
data_file = BASEDIR+'final_data.csv'
pre_file = BASEDIR+'pred_data_all.csv'
raw_data = json.loads(pd.read_csv(data_file, header=0).to_json(orient='records'))
pre_data = json.loads(pd.read_csv(pre_file, header=0).to_json(orient='records'))

# 影响函数
with open(BASEDIR + 'influence.json','r',encoding = 'utf-8') as fp:
    influenceData = json.load(fp)
    print('=====influence file read done')
fp.close()

with open(BASEDIR + 'anchors.json','r',encoding = 'utf-8') as fp:
    anchorData = json.load(fp)
    print('=====anchor file read done')
fp.close()


# ------- Initialize Model ------- #
# 加载训练好的模型
# model = load_model(BASEDIR+'svm_FICO_500.pth')
# train_loader,test_loader,train_set,test_set= loader_data()
model = load_model()



# ------ Help Function ------- #
def getSingleSample(idx):
    sample = copy.deepcopy(raw_data[idx])
    sample['prediction'] = adult_target_value[pre_data[idx]['prediction']]
    sample['category'] = pre_data[idx]['category']
    sample['percentage'] = pre_data[idx]['percentage']
    return sample

def getAnchorData(anchorData):
    ans = {}
    ans['feature'] = anchorData['feature']
    ans['precision'] = anchorData['precision']
    examples = anchorData['examples']

    newEx =[]
    for ex in examples:
        cts = []
        cfs = []
        covered_true = ex['covered_true']
        covered_false = ex['covered_false']
        for ct in covered_true:
            tmp = getSingleSample(ct)
            cts.append(tmp)
        for cf in covered_false:
            tmp = getSingleSample(cf)
            cfs.append(tmp)
        newEx.append({'covered_true':cts,'covered_false':cfs})
    ans['examples'] = newEx
    return ans
    


# ------ Initialize WebApp ------- #
app = Flask(__name__)

@app.route('/getPredData')
def getPredData( ):
    idx = -1
    idx = request.args.get('idx')

    response = {}
    response['total'] = len(pre_data)
    
    if idx != None:
        idx = int(idx)
        response['data'] = pre_data[idx]
        # response['data'] = pre_data.to_json(index = idx)
    else:
        response['data'] = pre_data

    return toJson(response)
    

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
        #! anchor 算法
        # anchors = find_anchor(idx,model)
        if idx > len(anchorData): anchors = []
        else: anchors = getAnchorData( anchorData[str(idx)])
        # anchors = anchorData[str(idx)]
        sample = getSingleSample(idx)

        response = {}
        response['id'] = idx
        response['total'] = len(raw_data)
        response['sample'] = sample
        response['anchor'] = anchors
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


@app.route('/getDataLength')
def getDataLength():
    return toJson(len(raw_data))

# @app.route('/runModel',methods=['GET', 'POST'])
# def runModel():
#     if request.method == 'POST':
#         print(request.json)
#         test_set = request.json
#         # model = load_model(save_path)
#         x_test = torch.Tensor(test_set).to(device)
#         y = model.pred(x_test).item()
#         y_prob = model(x_test).item()
#         print("Test result:\t{:.2%}\t{:.2%}".format(y,y_prob))

#         response = {}
#         response['predict'] = y
#         response['possible'] = y_prob
#         return toJson(response)


# ------- Run WebApp ------- #

# if __name__ == '__main__':
#     app.run(port=3001, host="0.0.0.0", debug=True, threaded=True)
    # serve(app, host="0.0.0.0",port=3001)