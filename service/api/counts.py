from flask import (
    Blueprint, current_app, request, session
)

from ..db import ata_connection

bp = Blueprint('counts_api', __name__, url_prefix='/api')

@bp.route('/counts', methods=('POST',))
def get_counts():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return {
                'exams': len(error_list['exam_id'].unique()),
                'errors': error_list.shape[0],
                'source_texts_count': len(error_list['src_text'].unique()),
                'years': f'{error_list["year"].min()} - {error_list["year"].max()}'
            }
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Counts could not be retrieved.",
    }
