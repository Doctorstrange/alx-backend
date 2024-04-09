#!/usr/bin/env python3
'''basic Flask app
'''

from flask import Flask, render_template
from flask_babel import Babel


class Config:
    '''Config class'''

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False

babel = Babel(app)


@babel.localeselector
def get_locale():
    """ determine the best match with our supported languages.
    Returns: best match
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    '''home page'''
    return render_template("1-index.html",)


if __name__ == "__main__":
    app.run(debug=True)
