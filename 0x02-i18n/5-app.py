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


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> Union[Dict, None]:
    """get user with user id.
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id))
    return None


@app.before_request
def before_request() -> None:
    """before request
    """

    g.user = get_user()


@babel.localeselector
def get_locale():
    """ determine the best match with our supported languages.
    Returns: best match
    """
    locale_arg = request.args.get('locale')
    if locale_arg in app.config['LANGUAGES']:
        return locale_arg
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    '''home page'''
    return render_template("4-index.html",)


if __name__ == "__main__":
    app.run(debug=True)
