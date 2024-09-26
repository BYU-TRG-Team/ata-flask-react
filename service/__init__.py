import os

from flask import Flask
from flask_jwt_extended import JWTManager

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_folder='frontend/dist')
    app.config.from_pyfile(os.path.join(app.instance_path, 'config.py'))

    jwt = JWTManager(app)

    with app.app_context():
        from . import db

    from . import server
    app.register_blueprint(server.bp)

    from .api import counts, errors, filters
    app.register_blueprint(counts.bp)
    app.register_blueprint(errors.bp)
    app.register_blueprint(filters.bp)

    # from . import auth
    # app.register_blueprint(auth.bp)

    # from . import editor
    # app.register_blueprint(editor.bp)

    return app
