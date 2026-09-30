from flask import Flask, request, jsonify
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from datetime import datetime
import pytz
from BitunixImageGenerator import register_bitunix_routes

app = Flask(__name__)
register_bitunix_routes(app)

# Rutas a las imágenes de fondo
LONG_IMAGE = "long.jpg"
SHORT_IMAGE = "short.jpg"

# Zona horaria UTC
UTC_TZ = pytz.timezone('UTC')

@app.route('/api/futures/image', methods=['POST'])
def generate_image():
    # Verificar que la solicitud provenga de localhost
    if request.remote_addr not in ['127.0.0.1', '::1']:
        return jsonify({'error': 'Access forbidden: only localhost is allowed'}), 403

    # Recibe los datos JSON
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Extraer los valores del JSON
    entry_type = data.get('type', 'N/A')
    leverage = data.get('leverage', 'N/A')
    symbol = data.get('symbol', 'N/A')
    entry = data.get('entry', 'N/A')
    mark = data.get('mark', 'N/A')
    profit = data.get('profit', 'N/A')
    usdt_per_trade = float(data.get('usdt_per_trade', 100.0))
    profit_usdt = data.get('profit_usdt')

    # Seleccionar la imagen de fondo según el tipo de entrada
    if entry_type.lower() == "long":
        background_image = LONG_IMAGE
    elif entry_type.lower() == "short":
        background_image = SHORT_IMAGE
    else:
        return jsonify({'error': 'Invalid entry type. Must be "Long" or "Short"'}), 400

    # Cargar la imagen de fondo
    try:
        image = Image.open(background_image).convert("RGB")
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    draw = ImageDraw.Draw(image)
    
    # Configurar la fuente
    font_large = ImageFont.truetype("arialbd.ttf", 90)
    font_medium = ImageFont.truetype("arial.ttf", 30)
    font_symbol = ImageFont.truetype("arialbd.ttf", 25)
    font_small = ImageFont.truetype("arial.ttf", 23)
    font_profit_usdt = ImageFont.truetype("arial.ttf", 38)

    # Colores
    white = (255, 255, 255)
    green = (0, 210, 150)
    red = (255, 70, 70)
    yellow = (255, 215, 0)

    # Determinar el color basado en si profit es negativo
    try:
        profit_value = float(profit.strip('%').replace('+', ''))
        text_color = red if profit_value < 0 else green
    except (ValueError, AttributeError):
        text_color = green

    # Posiciones específicas para los datos
    draw.text((300, 180), f"{symbol}  Perpetual", fill=white, font=font_symbol)

    # Ganancia o pérdida en porcentaje
    profit_text = f"{profit}"
    draw.text((100, 220), profit_text, fill=text_color, font=font_large)

    # Usar el PnL exacto del tramo cerrado; el porcentaje puede estar redondeado.
    try:
        if profit_usdt is not None:
            usdt_gain = float(profit_usdt)
        else:
            profit_value = float(profit.strip('%').replace('+', ''))
            usdt_gain = (profit_value / 100) * usdt_per_trade
        usdt_text = f"({usdt_gain:+.2f} USDT)"
    except (ValueError, TypeError, AttributeError):
        usdt_text = "(N/A USDT)"

    # Calcular la posición del texto en USDT
    profit_text_width = draw.textlength(profit_text, font=font_large)
    usdt_x_position = 100 + profit_text_width + 20
    draw.text((usdt_x_position, 260), usdt_text, fill=text_color, font=font_profit_usdt)

    # Valores de Entry Price y Last Price
    draw.text((280, 340), f"{entry}", fill=yellow, font=font_medium)
    draw.text((280, 380), f"{mark}", fill=yellow, font=font_medium)

    # Agregar Time Stamp en UTC
    current_time = datetime.now(UTC_TZ).strftime("%Y-%m-%d %H:%M UTC")
    draw.text((image.width - 380, image.height - 40), f"Time Stamp: {current_time}", fill=white, font=font_small)

    # Guardar la imagen generada en memoria
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)

    # Convertir la imagen a Base64
    img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')

    # Devolver la imagen Base64
    return jsonify({'image': f'data:image/jpeg;base64,{img_base64}'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3000)