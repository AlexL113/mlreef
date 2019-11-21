import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { string, number } from 'prop-types';
import folderIcon from '../images/folder_01.svg';
import fileIcon from '../images/file_01.svg';
import filesApi from '../apis/FilesApi';

class FilesContainer extends Component {
  constructor(props) {
    super(props);
    this.getBack = this.getBack.bind(this);

    this.state = {
      currentPath: '',
      currentBranch: '',
      files: [],
      redirect: false,
    };
  }

  componentDidUpdate() {
    const {
      path,
      branch,
    } = this.props;
    const {
      currentBranch,
      currentPath,
    } = this.state;
    const urlPath = path
      ? decodeURIComponent(path)
      : null;
    if (
      branch !== currentBranch
        || urlPath !== currentPath
    ) {
      try {
        this.updateFilesArray();
      } catch (error) {
        console.log(error);
      }
      this.setState({
        currentPath: urlPath,
        currentBranch: branch,
      });
    }
  }

  getReturnOption = () => (
    window.location.href.includes('path') ? (
      <tr className="files-row">
        <td className="file-type">
          <button
            type="button"
            onClick={this.getBack}
            style={{ padding: '0' }}
          >
            <img src={folderIcon} alt="" />
          </button>
          <button
            type="button"
            onClick={this.getBack}
          >
                ..
          </button>
        </td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    )
      : null);

  updateFilesArray = () => {
    const {
      projectId,
      path,
      branch,
    } = this.props;
    filesApi.getFilesPerProject(
      projectId,
      path || '',
      false,
      branch,
    ).then((res) => {
      this.setState({ files: res });
    })
      .catch(
        () => this.setState({ redirect: true }),
      );
  }

  getBack = () => window.history.back()

  render = () => {
    const { redirect, files } = this.state;
    const { projectId, branch } = this.props;
    return (
      <>
        {redirect
          ? <Redirect to="/error-page" />
          : null}
        <div className="files-container">
          <div className="commit-status">
            <p id="commitStatus">
              This branch is
              {' '}
              <b>123 commits</b>
              {' '}
              ahead and
              {' '}
              <b>1 commit</b>
              {' '}
              behind
              {' '}
              <b>&quot;master&quot;.</b>
            </p>
            <button
              type="button"
              className="create-pr"
            >
              <p>
              Create Pull Request
              </p>
            </button>
          </div>

          <table className="file-properties" id="file-tree">
            <thead>
              <tr className="title-row">
                <th>
                  <p id="paragraphName">Name</p>
                </th>
              </tr>
            </thead>

            <tbody>
              {this.getReturnOption()}
              {files.map((file) => {
                let icon;
                let routeType = '';
                if (file.type === 'tree') {
                  routeType = 'path';
                  icon = folderIcon;
                } else {
                  routeType = 'blob';
                  icon = fileIcon;
                }
                const link = `/my-projects/${projectId}/${branch}/${routeType}/${encodeURIComponent(file.path)}`;
                return (
                  <tr key={`${file.id} ${file.name}`} className="files-row">
                    <td className="file-type">
                      <Link to={link}>
                        <img src={icon} alt="" />
                      </Link>
                      <Link to={link} className="file-name-link">
                        {file.name}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

FilesContainer.propTypes = {
  projectId: number.isRequired,
  branch: string.isRequired,
  path: string.isRequired,
};

export default FilesContainer;
