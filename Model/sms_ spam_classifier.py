import pickle
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import string
from flask import Flask, request, jsonify
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def toLowerCase(text):

    text = text.lower()
    return text


def tokenization(text):

    text = nltk.word_tokenize(text)
    return text

def removeSpecialCharacters(text):

    new_text = []
    for i in text:
        if i.isalnum():
            new_text.append(i)
    
    return new_text

def removeStopWordsAndPunctuation(text):
    
    y = []
    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    return y

def stemming(text):

    ps = PorterStemmer()
    y = []

    for i in text:
        y.append(ps.stem(i))

    return y



def transformText(text):

    text = toLowerCase(text)
    text = tokenization(text)
    text = removeSpecialCharacters(text)
    text = removeStopWordsAndPunctuation(text)
    text = stemming(text)

    return " ".join(text)


def textVectorizer(path='Model/vectorizer.pkl', text = []):

    with open(path, 'rb') as file:
        vectorizer = pickle.load(file)
        vectorizer = vectorizer.transform(text)
        return vectorizer

def modelPredict(path='Model/model.pkl', text = []):        

    with open(path, 'rb') as file:
        model = pickle.load(file)
        y_pred = model.predict(text)
        return y_pred



def runModel(text):

    X = transformText(text)
    X = textVectorizer(text=[X])
    y_pred = modelPredict(text=X)
    return y_pred[0]


app = Flask(__name__)

@app.route("/predict", methods = ["POST"])

def predict():

    try:

        data = request.get_json()

        sms = data.get("sms", "")

        prediction = runModel(text=sms)

        return jsonify({

            "prediction": int(prediction),
            "label" : "spam" if prediction == 1 else "ham"
        })
    
    except Exception as e:

        return jsonify({

            "error" : str(e)
        }), 500
    

if __name__ == "__main__":
    
    app.run(port=5000, debug=True)