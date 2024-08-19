from flask import (
    Blueprint, current_app, request, session
)

from .db import ata_connection

bp = Blueprint('exams_api', __name__, url_prefix='/api')

@bp.route('/exams/count', methods=('POST',))
def count_errors():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return {
                'count': str(len(error_list['exam_id'].unique()))
            }
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Exams could not be counted."
    }


@bp.route('/exams', methods=('POST',))
def get_errors():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return error_list['exam_id'].to_json()
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Errors could not be retrieved.",
    }
