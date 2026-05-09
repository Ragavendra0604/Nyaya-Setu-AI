from flask import Flask
from flask_cors import CORS
from routes.ai_routes import ai_bp
from config.settings import Settings

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(ai_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=Settings.PORT, debug=True)