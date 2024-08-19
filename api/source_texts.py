from flask import (
    Blueprint, current_app, request, session
)

from .db import ata_connection

bp = Blueprint('source_texts_api', __name__, url_prefix='/api')

@bp.route('/source_texts/count', methods=('POST',))
def count_errors():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return {
                'count': str(len(error_list['src_text'].unique()))
            }
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Source texts could not be counted."
    }


@bp.route('/source_texts', methods=('POST',))
def get_errors():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return error_list['src_text'].to_json()
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Source texts could not be retrieved.",
    }
