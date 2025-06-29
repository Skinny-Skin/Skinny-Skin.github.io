from flask import Flask, render_template, request, jsonify, send_from_directory
import qrcode
import io
import base64

app = Flask(__name__, template_folder='.')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/style.css')
def style():
    return send_from_directory('.', 'style.css')

@app.route('/generate', methods=['POST'])
def generate_qr():
    data = request.json['text']
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format='PNG')
    img_str = base64.b64encode(buf.getvalue()).decode("utf-8")
    return jsonify({'image': f'data:image/png;base64,{img_str}'})

if __name__ == '__main__':
    app.run(debug=True)
