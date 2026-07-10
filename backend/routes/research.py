from fastapi import APIRouter, HTTPException, status, Depends
from schemas import research
from db.database import research_collection, dinosaur_collection
from dependencies import auth
# pyrefly: ignore [missing-import]
from bson import ObjectId

router = APIRouter()

@router.post("/")
def submit_research(research_paper: research.ResearchPaper, current_user = Depends(auth.get_current_user)):
    data = research_paper.model_dump()
    data['researcher_id'] = str(current_user['_id'])
    data['researcher_name'] = current_user['name']
    data['status'] = 'pending'
    result = research_collection.insert_one(data)
    #todo,email service,notification
    return {
        'message': 'research submitted successfully',
        'id': str(result.inserted_id)
    }

@router.get('')
def latest_research():
    data = research_collection.find().sort('createdAt', -1).limit(8)
    data_list = list(data)
    for i in data_list:
        i['_id'] = str(i['_id'])
    return data_list

@router.get('/me')
def my_research(current_user = Depends(auth.get_current_user)):
    data = research_collection.find({'researcher_id': str(current_user['_id'])})
    data_list = list(data)
    for i in data_list:
        i['_id'] = str(i['_id'])
    return data_list

@router.get('/pending')
def pending_research(current_user = Depends(auth.admin_required)):
    data = research_collection.find({'status': 'pending'})
    data_list = list(data)
    for i in data_list:
        i['_id'] = str(i['_id'])
    return data_list

@router.get('/{research_id}')
def get_research(research_id: str):
    data = research_collection.find_one({'_id': ObjectId(research_id)})
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Research not found')
    data['_id'] = str(data['_id'])
    return data
    
@router.patch('/{research_id}/approve')
def approve_research(research_id: str, current_user = Depends(auth.admin_required)):
    research_doc = research_collection.find_one({'_id': ObjectId(research_id)})
    if research_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Research not found')
    
    if research_doc.get('status') != 'pending':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Research is already approved or rejected')
    
    slug = research_doc.get('slug')
    research_type = research_doc.get('research_type')
    dinosaur = dinosaur_collection.find_one({'slug': slug})
    
    if research_type == 'update':
        if not dinosaur:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail='Cannot update a dinosaur that does not exist in the database'
            )
        proposed_change = research_doc.get('proposedChange')
        if not proposed_change:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail='Proposed changes are missing'
            )
        # Filter out keys with None values to prevent data loss
        update_data = {k: v for k, v in proposed_change.items() if v is not None}
        if update_data:
            dinosaur_collection.update_one(
                {'_id': dinosaur['_id']},
                {'$set': update_data}
            )
            
    elif research_type == 'new':
        if dinosaur:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail='Dinosaur with this slug already exists'
            )
        new_dino = research_doc.get('new_dinosaur')
        if not new_dino:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail='New dinosaur data is missing'
            )
        dinosaur_collection.insert_one(new_dino)
        
    research_collection.update_one({'_id': ObjectId(research_id)}, {'$set': {'status': 'approved'}})
    #email,notification left
    return {
        'message': 'Research approved successfully'
    }

@router.patch('/{research_id}/reject')
def reject_research(research_id: str, current_user = Depends(auth.admin_required)):
    research_doc = research_collection.find_one({'_id': ObjectId(research_id)})
    if research_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Research not found')
    
    if research_doc.get('status') != 'pending':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Research is already approved or rejected')
        
    research_collection.update_one({'_id': ObjectId(research_id)}, {'$set': {'status': 'rejected'}})
    #email,notification left
    return {
        'message': 'Research rejected successfully'
    }

@router.delete('/{research_id}')
def delete_research(research_id: str, current_user = Depends(auth.admin_required)):
    research_doc = research_collection.find_one({'_id': ObjectId(research_id)})
    if research_doc is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Research not found')
    research_collection.delete_one({'_id': ObjectId(research_id)})
    return {
        'message': 'Research deleted successfully'
    }
