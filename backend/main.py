from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routes import contact, auth, timeline, research, quiz, dinosaur, community_redit, admin

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("RAW VALIDATION ERRORS:", exc.errors())
    error_messages = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error.get("loc", []) if loc != "body"])
        msg = error.get("msg", "Validation error")
        error_messages.append(f"{field}: {msg}")
    
    joined_errors = "; ".join(error_messages)
    return JSONResponse(
        status_code=422,
        content={"detail": f"Validation failed: {joined_errors}"}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact.router, prefix="/contact", tags=['Contact'])
app.include_router(auth.router, prefix='/auth', tags=['Authentication'])
app.include_router(timeline.router, prefix='/timeline', tags=['Timeline'])
app.include_router(research.router, prefix='/research', tags=['Research'])
app.include_router(quiz.router, prefix='/quiz', tags=['Quiz'])
app.include_router(dinosaur.router, prefix='/dinosaurs', tags=['Dinosaur'])
app.include_router(community_redit.router, prefix='/community', tags=['Community'])
app.include_router(admin.router, prefix='/admin', tags=['Admin'])
