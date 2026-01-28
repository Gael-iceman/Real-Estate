import React, { Component, Fragment } from "react";
import { uploadImage } from "../../actions/images";
import { connect } from "react-redux";

const initialState = {
  selectedFiles: [],
  localUrls: [],
  error: "",
  pleaseWait: "",
  progress: 0,
  uploadedCount: 0
};

const allowedImageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".avif"
];

const isAllowedImageFile = file => {
  const name = String(file?.name || "");
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  return allowedImageExtensions.includes(ext);
};

class ImagesUpload extends Component {
  state = initialState;

  revokeUrls = urls => {
    urls.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (err) {
        // ignore cleanup errors
      }
    });
  };

  handleImage = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const invalidFiles = files.filter(file => !isAllowedImageFile(file));
    if (invalidFiles.length) {
      this.revokeUrls(this.state.localUrls);
      this.setState({
        selectedFiles: [],
        localUrls: [],
        error: `Only image files with these extensions are allowed: ${allowedImageExtensions.join(", ")}`,
        pleaseWait: "",
        progress: 0,
        uploadedCount: 0
      });
      return;
    }
    this.revokeUrls(this.state.localUrls);
    const localUrls = files.map(file => URL.createObjectURL(file));
    this.setState({
      selectedFiles: files,
      localUrls,
      error: "",
      pleaseWait: "",
      progress: 0,
      uploadedCount: 0
    });
  };

  uploadImage = async () => {
    const { selectedFiles } = this.state;
    if (!selectedFiles.length) {
      this.setState({
        error: "Please select images to upload first"
      });
      return;
    }

    this.setState({
      pleaseWait: `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? "s" : ""}`,
      error: "",
      progress: 0,
      uploadedCount: 0
    });

    let uploadedCount = 0;
    for (const file of selectedFiles) {
      const fd = new FormData();
      fd.append("image", file, file.name);
      await this.props.uploadImage(fd, this.props.propertyId);
      uploadedCount += 1;
      const progress = Math.round((uploadedCount / selectedFiles.length) * 100);
      this.setState({ uploadedCount, progress });
    }

    this.revokeUrls(this.state.localUrls);
    this.setState(initialState);
  };

  componentWillUnmount = () => {
    this.revokeUrls(this.state.localUrls);
  };

  render() {
    return (
      <Fragment>
        <div>
          {this.state.error ? (
            <div className="alert alert-danger my-3" role="alert">
              {this.state.error}
            </div>
          ) : (
            ""
          )}

          <div className="card mt-3">
            {this.state.localUrls.length ? (
              <Fragment>
                {this.state.pleaseWait ? (
                  <Fragment>
                    <div className="alert alert-success" role="alert">
                      {this.state.pleaseWait}
                    </div>
                    <div className="progress my-2">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${this.state.progress}%` }}
                        aria-valuenow={this.state.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {this.state.progress}%
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  ""
                )}
                <div className="row px-3">
                  {this.state.localUrls.map((url, index) => (
                    <div className="col-6 col-md-4 mb-3" key={url}>
                      <img
                        style={{ height: "160px", objectFit: "cover", width: "100%" }}
                        className="img-thumbnail"
                        src={url}
                        alt={`Selected upload ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <hr />
                <button
                  type="button"
                  onClick={this.uploadImage}
                  className="btn btn-primary"
                >
                  Upload Images
                </button>
              </Fragment>
            ) : (
              ""
            )}
            <div className="card-body">
              <h5 className="card-title">Upload Images</h5>
              <p className="card-text">
                Select one or more images, review the previews, then upload.
              </p>

              <div className="input-group mb-3">
                <div className="input-group-prepend"></div>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    onChange={this.handleImage}
                    accept={`image/*,${allowedImageExtensions.join(",")}`}
                    multiple
                  />
                  <label className="custom-file-label">
                    {this.state.selectedFiles.length
                      ? `${this.state.selectedFiles.length} file${this.state.selectedFiles.length > 1 ? "s" : ""} selected`
                      : "Choose files"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    images: state.imageReducer.addedImages
  };
}

export default connect(mapStateToProps, { uploadImage })(ImagesUpload);
