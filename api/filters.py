#!/usr/bin/env python3

from json import dumps
from flask import (
    Blueprint
)

from ..db import ata_connection

bp = Blueprint('filters_api', __name__, url_prefix='/api')

@bp.route('/filters', methods=('POST',))
def get_counts():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            ret = {
                'ata_points_range': {
                    'min': str(error_list['ata_points'].min()),
                    'max': str(error_list['ata_points'].max())
                },
                'ata_score_range': {
                    'min': str(error_list['ata_score'].min()),
                    'max': str(error_list['ata_score'].max())
                },
                'passage_letters': error_list['text_letter'].unique().tolist(),
                'src_langs': error_list['src_lang'].unique().tolist(),
                'tgt_langs': error_list['tgt_lang'].unique().tolist(),
                'error_types': error_list['name'].unique().tolist(),
                'severities': error_list['severity'].unique().tolist(),
                'ata_codes': error_list['ata_code'].unique().tolist()
            }
            return dumps(ret)
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Counts could not be retrieved.",
    }
