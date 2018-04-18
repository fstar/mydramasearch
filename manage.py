from flask_script import Manager
from gevent.wsgi import WSGIServer
from app import create_app
from flask_migrate import MigrateCommand

app = create_app()

manager = Manager(app)

manager.add_command('db', MigrateCommand)


@manager.option('-m', '--mode', help='模式')
@manager.option("-p", "--port", help="端口")
def run(mode='debug', port=5000):
    if mode == "gevent":
        http_server = WSGIServer(('', port), app)
        http_server.serve_forever()
    elif mode == "debug":
        app.run('0.0.0.0', int(port), debug=True)
    else:
        raise "No mode"


if __name__ == "__main__":
    manager.run()