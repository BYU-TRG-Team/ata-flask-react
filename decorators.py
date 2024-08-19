import functools

from flask import g
from flask_jwt_extended import jwt_required

def login_required(view):
    @functools.wraps(view)
    @jwt_required()
    def wrapped_view(**kwargs):
        if g.author is None:
            return {
                'error': 'Not logged in.'
            }

        return view(**kwargs)

    return wrapped_view