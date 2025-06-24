const Note = require("../models/note");

exports.createNote = async (req, res) => {
  try {
    const { videoId, content } = req.body;
    const userId = req.user.id;
    if (!videoId || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    const newNote = await Note.create({
      user: userId,
      video: videoId,
      content,
    });
    return res.status(201).json({ success: true, data: newNote });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Error", error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.body;
    if (!videoId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing videoId" });
    }
    const notes = await Note.find({ user: userId, video: videoId }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({ success: true, data: notes });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: err.message,
    });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    if (!noteId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing noteId" });
    }
    const note = await Note.findById(noteId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await note.deleteOne();
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal error", error: err.message });
  }
};
