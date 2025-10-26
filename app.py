from flask import Flask, render_template, request, redirect, url_for
from extensions import csrf
from config import DevelopmentConfig
from extensions import db
from controller.controller_administracion import admin_bp
from controller.controller_venta import venta_bp
from controller.portal_controller import portal_cliente_bp
from controller.controller_galletas import galletas_bp
from controller.controller_produccion import produccion_bp

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db.init_app(app)
csrf.init_app(app)

app.register_blueprint(admin_bp, url_prefix='/administracion')
app.register_blueprint(venta_bp, url_prefix='/venta')
app.register_blueprint(produccion_bp, url_prefix='/produccion')
app.register_blueprint(galletas_bp, url_prefix='/galletas')
app.register_blueprint(portal_cliente_bp)

@app.route("/administrador")
def proveedores():
    return redirect(url_for('administracion.proveedor.proveedores'))

@app.route("/venta")
@app.route("/ventas")
def ventas():
    return redirect(url_for('venta.ventas'))

@app.route('/')
def index():
    return redirect(url_for('portal_cliente.index'))

if __name__ == '__main__':    
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True, port=3000)