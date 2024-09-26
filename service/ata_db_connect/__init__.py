import pandas as pd
import psycopg2
from psycopg2.extras import RealDictCursor
from configparser import ConfigParser
from types import ModuleType
# You must create a config.py file and pass its path into the class constructor
# DB_HOST
# DB_PORT
# DB_NAME
# DB_USER
# DB_PASSWORD

class Connection:
    def __init__(self, config):
        if isinstance(config, str) and config.endswith('.ini'):
            self.config = ConfigParser()
            self.config.read(config)
        elif isinstance(config, object):
            self.config = config
        else:
            raise ValueError('A config file must be a valid .ini file.')

    def _get_db_connection(self):
        try:
            if isinstance(self.config, ModuleType):
                conn = psycopg2.connect(
                    host=self.config.DB_HOST,
                    port=self.config.DB_PORT,
                    database=self.config.DB_NAME,
                    user=self.config.DB_USER,
                    password=self.config.DB_PASSWORD
                )
            else:
                conn = psycopg2.connect(
                    host=self.config['DB_HOST'],
                    port=self.config['DB_PORT'],
                    database=self.config['DB_NAME'],
                    user=self.config['DB_USER'],
                    password=self.config['DB_PASSWORD']
                )

            print(conn)
            return conn
        except psycopg2.DatabaseError as e:
            print(f"Database connection error: {e}")
            return None, None
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return None, None

    def fetch_error_list(self):
        conn = self._get_db_connection()
        if conn is None:
            return None

        try:
            cur = conn.cursor()
            query = '''
            SELECT exam_pieces.test_taker_id, exam_pieces.src_lang, exam_pieces.tgt_lang, exam_pieces.ata_score, exam_pieces.year, exam_pieces.passed,
                exam_pieces.text_letter, errors.grader_id, errors.name, errors.severity, errors.ata_code, errors.ata_points, target_text_segments.segment,
                errors.start_index, errors.end_index, source_text.text, source_segments_info.seg_start, source_segments_info.seg_end
            FROM errors
            JOIN exam_pieces ON exam_pieces.test_taker_id = errors.exam_id
                            AND exam_pieces.grader_id = errors.grader_id
                            AND exam_pieces.src_id = errors.src_text_id
            JOIN target_text_segments ON errors.src_text_id = target_text_segments.src_text_id
                                    AND errors.exam_id = target_text_segments.exam_id
                                    AND errors.seg_num = target_text_segments.seg_num
            JOIN source_text ON errors.src_text_id = source_text.id
            JOIN source_segments_info ON errors.exam_id = source_segments_info.exam_id
                                    AND errors.src_text_id = source_segments_info.text_id
                                    AND errors.seg_num = source_segments_info.seg_num
            '''
            cur.execute(query)
            error_list = cur.fetchall()
            error_list = pd.DataFrame(error_list, columns=['exam_id', 'src_lang', 'tgt_lang', 'ata_score', 'year', 'passed', 'text_letter', 'grader_id', 'name', 'severity',
                                                        'ata_code', 'ata_points', 'tgt_seg', 'error_start', 'error_end', 'src_text', 'src_start', 'src_end'])
            cur.close()
            conn.close()
            return error_list
        except psycopg2.OperationalError as e:
            print(f"Operational error: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
        finally:
            if conn:
                conn.close()
        return None
