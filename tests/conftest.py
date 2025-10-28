import pytest
import os
import sys
from datetime import datetime, date

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture
def app():
    """Fixture de aplicación Flask para pruebas"""
    from app import app as flask_app
    from extensions import db
    
    # Configuración para testing
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['SECRET_KEY'] = 'test-secret-key'
    flask_app.config['WTF_CSRF_ENABLED'] = False
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Cliente de prueba para hacer requests"""
    return app.test_client()

@pytest.fixture
def db_session(app):
    """Sesión de base de datos para pruebas"""
    from extensions import db
    return db.session

@pytest.fixture
def sample_persona(db_session):
    """Fixture para crear una persona de prueba"""
    from model.persona import Persona
    
    persona = Persona(
        genero="M",
        apPaterno="García",
        apMaterno="López",
        nombre="Juan",
        telefono="5512345678",
        calle="Reforma",
        numero=123,
        colonia="Centro",
        codigoPostal=12345,
        email="juan@example.com",
        fechaNacimiento=date(1990, 1, 1)
    )
    
    db_session.add(persona)
    db_session.commit()
    return persona

@pytest.fixture
def sample_usuario(db_session):
    """Fixture para crear un usuario de prueba - CORREGIDO"""
    from model.usuario import Usuario
    
    usuario = Usuario(
        nombreUsuario="testuser",
        estatus=1,
        rol="ADM"  # Ajusta según los roles que uses
    )
    usuario.set_password("testpass")  # Usar el método correcto para la contraseña
    
    db_session.add(usuario)
    db_session.commit()
    return usuario

@pytest.fixture
def sample_cliente(db_session, sample_persona, sample_usuario):
    """Fixture para crear un cliente de prueba"""
    from model.cliente import Cliente
    
    cliente = Cliente(
        idPersona=sample_persona.idPersona,
        idUsuario=sample_usuario.idUsuario
    )
    
    db_session.add(cliente)
    db_session.commit()
    return cliente