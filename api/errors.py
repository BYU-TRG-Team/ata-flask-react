from flask import (
    Blueprint, current_app, request, session
)

from ..db import ata_connection

bp = Blueprint('errors_api', __name__, url_prefix='/api')

@bp.route('/errors/count', methods=('POST',))
def count_errors():
    error = None

    try:
        error_list = ata_connection.fetch_error_list()
        if error is None:
            return {
                'count': str(error_list.shape[0])
            }
    except Exception as e:
        error = e
        pass

    return {
        'error': error or "Exams could not be counted."
    }


@bp.route('/errors', methods=('POST',))
def get_errors():
    error = None

    ata_points_range = request.json['ata_points_range']
    ata_score_range = request.json['ata_score_range']
    passage_letters = request.json['passage_letters']
    src_langs = request.json['src_langs']
    tgt_langs = request.json['tgt_langs']
    error_types = request.json['error_types']
    severities = request.json['severities']
    ata_codes = request.json['ata_codes']
    try:
        error_list = ata_connection.fetch_error_list()
        filtered_errors = error_list[
            (error_list.ata_points.between(ata_points_range['min'], ata_points_range['max'])) &
            (error_list.ata_score.between(ata_score_range['min'], ata_score_range['max']))
        ]
        if passage_letters:
            filtered_errors = filtered_errors[filtered_errors['text_letter'].isin(passage_letters)]
        if src_langs:
            filtered_errors = filtered_errors[filtered_errors['src_lang'].isin(src_langs)]
        if tgt_langs:
            filtered_errors = filtered_errors[filtered_errors['tgt_lang'].isin(tgt_langs)]
        if error_types:
            filtered_errors = filtered_errors[filtered_errors['name'].isin(error_types)]
        if severities:
            filtered_errors = filtered_errors[filtered_errors['severity'].isin(severities)]
        if ata_codes:
            filtered_errors = filtered_errors[filtered_errors['ata_code'].isin(ata_codes)]

        filtered_errors['marked_tgt_seg'] = [
                    mark_error(tgt_seg, start, end) for tgt_seg, start, end in zip(filtered_errors['tgt_seg'], filtered_errors['error_start'], filtered_errors['error_end'])
                ]
        filtered_errors['simplified_src_text'] = [
            src_text[start:end] for src_text, start, end in zip(filtered_errors['src_text'], filtered_errors['src_start'], filtered_errors['src_end'])
        ]

        if error is None:
            return filtered_errors[['exam_id', 'marked_tgt_seg', 'simplified_src_text', 'name', 'severity', 'ata_points', 'ata_score']].to_json()
    except Exception as e:
        error = e
        pass
    
    return {
        'error': error or "Errors could not be retrieved.",
    }

def mark_error(text, start, end):
    start -= 1
    end += 1
    return text[:start] + '<span class="highlight">' + text[start:end] + '</span>' + text[end:]
