import os
import sys
import boto3
import botocore
import json
import configparser

import logging
from logging.handlers import RotatingFileHandler
from logging import Formatter

from flask import Flask
from flask_jwt_extended import JWTManager

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True, static_folder='frontend/dist')
    app.config_path = os.path.join(app.instance_path, 'config.ini')

    jwt = JWTManager(app)

    with app.app_context():
        try:
            from .db import ata_connection 
        except:
            raise ConnectionError("Error: Could not connect to the database.")
    
    from .api import counts, errors, filters
    app.register_blueprint(counts.bp)
    app.register_blueprint(errors.bp)
    app.register_blueprint(filters.bp)
    # from . import server
    # app.register_blueprint(server.bp)


    if not os.path.exists('logs'):
        os.makedirs('logs')

    # create a file handler
    handler = RotatingFileHandler('logs/ata-db.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    handler.setFormatter(Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))

    # create a logging format
    formatter = Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    handler.setFormatter(formatter)
    
    # set the app logger level
    app.logger.setLevel(logging.INFO)
    app.logger.addHandler(handler)

    if (test_config is not True):
        try:
            boto3.client('sts').get_caller_identity()
            aws_connected = True
        except botocore.exceptions.NoCredentialsError:
            aws_connected = False
            raise("No AWS credentials found.")

        if aws_connected:
            # create a CloudWatch Logs client.
            cw_client = boto3.client('logs')
            log_group_name = 'ata_db_api_docker_image_logs'
            log_stream_name = 'ata-db'

            # create a CloudWatch Logs stream.
            try:
                cw_client.create_log_stream(
                    logGroupName=log_group_name,
                    logStreamName=log_stream_name
                )
            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == 'ResourceAlreadyExistsException':
                    pass
                else:
                    raise

            # send logs to CloudWatch.
            class CloudWatchHandler(logging.Handler):
                def __init__(self):
                    logging.Handler.__init__(self)

                def emit(self, record):
                    log_entry = self.format(record)
                    cw_client.put_log_events(
                        logGroupName=log_group_name,
                        logStreamName=log_stream_name,
                        logEvents=[
                            {
                                'timestamp': int(record.created * 1000),
                                'message': log_entry
                            }
                        ]
                    )

            cw_handler = CloudWatchHandler()
            cw_handler.setLevel(logging.INFO)
            cw_handler.setFormatter(formatter)
            app.logger.addHandler(cw_handler)

    return app
