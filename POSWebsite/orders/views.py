from django.shortcuts import render
import accounts.views  
from firebase_admin import firestore
import json
from django.http import HttpResponse,JsonResponse
from urllib import parse
# from accounts.views import curuser
from accounts.views import *
import datetime

# Create your views here.
db = firestore.client()


def menuItems():
    docs = db.collection(u'dishes').stream()
    dishes=[]
    for doc in docs:
        dishes.append(doc.to_dict())
    return dishes

def menuCategory(dishes):
    cat=[]
    for item in dishes:
        if item['Category'] not in cat:
            cat.append(item['Category'])
    # print(cat)
    return cat

def menuItems1(request):
    docs = db.collection(u'dishes').stream()
    dishes=[]
    for doc in docs:
        dishes.append(doc.to_dict())
    dishes1 = json.dumps(dishes)    
    # print(dishes1)
    return HttpResponse(dishes1)

def checkout(request):
    cart = json.loads(request.POST.get('cart'))
    us=curuser(request)
    # print(us['localId'])
    data = {
    u'cart': cart,
    
    }
    db.collection(u'users').document(us['localId']).update(data)
    
    return JsonResponse({
        'key_1':'value_1',
        'operation_status': 'ok or error',
        
    })

def menuCart(request):
    # print(us['localId'])
    us=curuser(request)
    if us!=None:
        doc_ref = db.collection(u'users').document(us['localId'])

        doc = doc_ref.get()
        if doc.exists:
            cartDoc=doc.to_dict()
            try: 
                return cartDoc['cart']
            except:
                return None
        else:
            print(u'No such document!')

            return None
        
    else:
        return None

def check(request):
    us=curuser(request)
    
    cart=menuCart(request)

    return render(request,'checkout.html',{"us":us,"cart":cart})


def confirm(request):
    if request.method=="POST":
        try:
            cart = json.loads(request.POST.get('cart'))
            address=request.POST.get('address')
            loc =json.loads(request.POST.get('loc'))
            total=float(request.POST.get('grnt'))
            
            timestamp=datetime.datetime.now()
            us=curuser(request)
            
            data = {
            u'cart': cart,
            u'user_email':  us['email'],
            u'user_name':us['displayName'],
            u'user_id':us['localId'],
            u'address': address,
            u'loc':loc,
            u'timestamp':timestamp,
            u'total':total
            }
            db.collection(u'currentOrders').document(us['localId']).set(data)
            # db.collection(u'users').document(us['localId']).set({u'cart':[]})
            return JsonResponse({
                
                'operation_status': 'ok'
                
            })
        except:
            return JsonResponse({
                
                'operation_status': 'error'
                
            })

def getAddress(request):
    # print(us['localId'])

    us=curuser(request)
    if us!=None:
        doc_ref = db.collection(u'users').document(us['localId'])

        doc = doc_ref.get()
        if doc.exists:
           addDoc=doc.to_dict()
           
           try: 
                n=json.dumps(addDoc['Addresses'])
                return JsonResponse({"add":n}) 
                
           except:
                return JsonResponse({"status":"error"})
        else:
            print(u'No such document!')

            return JsonResponse({"status":"error"})
        
    else:
        return None

def updateAddress(request):
    us=curuser(request)
    if us!=None:
        doc_ref = db.collection(u'users').document(us['localId'])

        if request.method=="POST":
                try:
                    
                    address=json.loads(request.POST.get('add'))
                    # loc =json.loads(request.POST.get('loc'))
                    # print("xxx1",address,loc)
                    # from firebase_admin import firestore              
                    doc_ref.update({u'Addresses': address})
                    return JsonResponse({
                            
                            'operation_status': 'ok'
                            
                        })
                except:
                    return JsonResponse({
                        
                        'operation_status': 'error'
                        
                    })
    
