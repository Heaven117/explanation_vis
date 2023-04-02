from models.data_process import *
from anchor import anchor_tabular

def find_anchor(sample_id,model):
    x_dataset,target,encoder = load_adult_income_dataset()
    # print(x_dataset.shape)

    x_sample = x_dataset[sample_id]
    predict_fn = lambda x: model.predict_anchor(x,encoder)

    explainer = anchor_tabular.AnchorTabularExplainer(adult_target_value, adult_process_names, x_dataset, categorical_names = {})
    exp = explainer.explain_instance(x_sample,predict_fn, threshold=0.95)
    
    anchors = []
    for f in exp.features():
        anchors.append(adult_process_names[f])
        
    # print(f'Anchor sample_id {sample_id}: ' ,exp.features())
    print(f'Anchor sample_id {sample_id}: ' ,anchors)
    print(f'Anchor sample_id {sample_id}:\n',exp.names())
    return anchors
    # exp.show_in_notebook()