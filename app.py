from flask import Flask, render_template, request, redirect, url_for, flash, send_file, session
from werkzeug.utils import secure_filename
from functools import wraps
import os
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['SESSION_TYPE'] = 'filesystem'

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Login credentials
USERNAME = "FranyVale"
PASSWORD = "Cinnamoroll777"

# Login session management
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            flash('Por favor, inicia sesión primero ♥')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    photos = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) 
              if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], f))]
    return render_template('index.html', photos=photos)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == USERNAME and request.form['password'] == PASSWORD:
            session['logged_in'] = True
            flash('¡Bienvenidos de nuevo! ♥')
            return redirect(url_for('index'))
        flash('Credenciales inválidas ♥')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('Has cerrado sesión ♥')
    return redirect(url_for('login'))

@app.route('/upload', methods=['POST'])
@login_required
def upload_file():
    if 'photo' not in request.files:
        flash('No se seleccionó ningún archivo ♥')
        return redirect(url_for('index'))
    file = request.files['photo']
    if file.filename == '':
        flash('No se seleccionó ninguna foto ♥')
        return redirect(url_for('index'))
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        flash('¡Foto subida con éxito! ♥')
    return redirect(url_for('index'))

@app.route('/delete/<filename>')
@login_required
def delete_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        flash('¡Foto eliminada con éxito! ♥')
    return redirect(url_for('index'))

@app.route('/download/<filename>')
@login_required
def download_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
