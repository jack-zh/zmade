import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        id = self.get_argument("id", None)
        print id, '---'
        code = self.get_argument("code", None)
        print code, '---'
        import json
        backObj = {"success":True}
        backStr = json.dumps(backObj)
        self.write("jsonpcallback('%s')" % backStr)


def main():
    tornado.options.parse_command_line()
    application = tornado.web.Application([
        (r"/", MainHandler),
    ])
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
