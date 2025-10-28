import pytest
import os
import sys
from datetime import datetime, date
import tempfile

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture(scope='session')
def app():
    """Fixture de aplicación Flask para pruebas - VERSIÓN MEJORADA"""
    from app import app as flask_app
    from extensions import db
    
    # Crear archivo temporal para la base de datos de pruebas
    db_fd, db_path = tempfile.mkstemp()
    
    # Configuración para testing
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    flask_app.config['SECRET_KEY'] = 'test-secret-key'
    flask_app.config['WTF_CSRF_ENABLED'] = False
    
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        # Cerrar y eliminar archivo temporal
        db.session.close()
        os.close(db_fd)
        os.unlink(db_path)

@pytest.fixture(scope='function')
def client(app):
    """Cliente de prueba para hacer requests"""
    return app.test_client()

@pytest.fixture(scope='function')
def db_session(app):
    """Sesión de base de datos para pruebas"""
    from extensions import db
    session = db.session
    # Limpiar datos entre tests sin borrar tablas
    for table in reversed(db.metadata.sorted_tables):
        session.execute(table.delete())
    session.commit()
    yield session
    # Rollback para limpiar cualquier cambio no commitado
    session.rollback()

@pytest.fixture(scope='function')
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

@pytest.fixture(scope='function')
def sample_usuario(db_session):
    """Fixture para crear un usuario de prueba"""
    from model.usuario import Usuario
    
    usuario = Usuario(
        nombreUsuario="testuser",
        estatus=1,
        rol="ADM"
    )
    usuario.set_password("testpass")
    
    db_session.add(usuario)
    db_session.commit()
    return usuario

@pytest.fixture(scope='function')
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