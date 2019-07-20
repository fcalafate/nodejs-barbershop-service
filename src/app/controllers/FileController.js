import File from '../models/File';

class FileController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;

    const file = File.create({ name, path });

    return res.json(file);
  }

  async update(req, res) {
    return res.json(500, 'not implemented');
  }
}

export default new FileController();
