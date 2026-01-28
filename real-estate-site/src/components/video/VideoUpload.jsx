import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { uploadVideo } from "../../actions/video";

const initialState = {
  selectedFile: null,
  localUrl: null,
  error: "",
  uploading: false
};

class VideoUpload extends Component {
  state = initialState;

  revokeUrl = url => {
    if (!url) return;
    try {
      URL.revokeObjectURL(url);
    } catch (err) {
      // ignore cleanup errors
    }
  };

  handleVideo = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    this.revokeUrl(this.state.localUrl);
    this.setState({
      selectedFile: file,
      localUrl: URL.createObjectURL(file),
      error: "",
      uploading: false
    });
  };

  uploadVideo = async () => {
    if (!this.state.selectedFile) {
      this.setState({ error: "Please select a video to upload first" });
      return;
    }

    this.setState({ uploading: true, error: "" });
    const fd = new FormData();
    fd.append("video", this.state.selectedFile, this.state.selectedFile.name);
    try {
      await this.props.uploadVideo(fd, this.props.propertyId);
      this.revokeUrl(this.state.localUrl);
      this.setState(initialState);
    } catch (err) {
      this.setState({ uploading: false, error: "Video upload failed" });
    }
  };

  componentWillUnmount = () => {
    this.revokeUrl(this.state.localUrl);
  };

  render() {
    const { currentVideoUrl } = this.props;
    return (
      <Fragment>
        {this.state.error ? (
          <div className="alert alert-danger my-3" role="alert">
            {this.state.error}
          </div>
        ) : (
          ""
        )}
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Upload Video Tour</h5>
            <p className="card-text">
              Add a short video tour for clients. Upload will replace any existing video.
            </p>

            {this.state.localUrl ? (
              <div className="mb-3">
                <video
                  controls
                  preload="metadata"
                  style={{ width: "100%", maxHeight: "360px" }}
                  src={this.state.localUrl}
                />
              </div>
            ) : currentVideoUrl ? (
              <div className="mb-3">
                <video
                  controls
                  preload="metadata"
                  style={{ width: "100%", maxHeight: "360px" }}
                  src={currentVideoUrl}
                />
              </div>
            ) : (
              ""
            )}

            <div className="input-group mb-3">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={this.handleVideo}
                  accept="video/*"
                />
                <label className="custom-file-label">
                  {this.state.selectedFile ? this.state.selectedFile.name : "Choose video"}
                </label>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.uploadVideo}
              disabled={this.state.uploading}
            >
              {this.state.uploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { uploadVideo })(VideoUpload);
