
const Contact = require("../models/Contact");

// POST: Submit contact form
exports.createContact = async (req, res) => {
  try {
    const { fullName, mobileNumber, email, subject, message } = req.body;

    if (!fullName || !mobileNumber || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const contact = await Contact.create({
      fullName,
      mobileNumber,
      email: email || "",
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been submitted successfully",
      data: contact,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET: Get all contact enquiries
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact enquiries",
    });
  }
};

// GET: Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid contact ID",
    });
  }
};

// PATCH: Update enquiry status
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact status updated successfully",
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to update contact status",
    });
  }
};

// DELETE: Delete enquiry
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact enquiry deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid contact ID",
    });
  }
};
