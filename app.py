from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

# --- Configuration for development/caching ---
# 1. Disable template caching to ensure Flask always reloads HTML files.
# 2. Disable static file caching to ensure the browser reloads CSS/JS.

app = Flask(__name__)

# Development configuration: Disable Caching
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Disable static file caching
app.jinja_env.cache = {} # Disable Jinja template caching

# --- SECURITY CONFIGURATION ---
# Flask requires a SECRET_KEY for session management and security.
# It MUST be read from an environment variable (e.g., set in Render).
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_insecure_key_PLEASE_CHANGE')

# Email configuration - Set these as environment variables
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USER = os.environ.get('EMAIL_USER', 'your-email@gmail.com')
EMAIL_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'your-app-password')
RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL', 'contact@datock.com')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = f'DaTock Inquiry: {subject}'
        
        body = f"""
        New inquiry from DaTock.com website:
        
        Name: {name}
        Email: {email}
        Subject: {subject}
        
        Message:
        {message}
        
        Received at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return jsonify({'success': True, 'message': 'Email sent successfully!'})
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send email. Please try again.'}), 500

@app.route('/sitemap.xml')
def sitemap():
    return render_template('sitemap.xml'), 200, {'Content-Type': 'application/xml'}

@app.route('/robots.txt')
def robots():
    return render_template('robots.txt'), 200, {'Content-Type': 'text/plain'}

if __name__ == '__main__':
    # When running locally, it's best to set debug=True for automatic reloads
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)