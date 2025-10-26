from dotenv import load_dotenv
import os

load_dotenv()

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_SECRET = True

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
