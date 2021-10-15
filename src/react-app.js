'use strict';

let reRenderValidate = true;

{/* Form for uploading documents to be validated */}
// eslint-disable-next-line no-undef
class ValidateForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            fileId: '',
            documentDropDown: []
        };
        this.handleSubmit = this.HandleSubmit.bind(this);
        this.handleDropDownChange = this.HandleDropDownChange.bind(this);
        // eslint-disable-next-line no-undef
        this.fileInput = React.createRef();
    }
    // Submits a file to be validated against a selected existing document
    HandleSubmit(event)
    {
        event.preventDefault();
        const form = new FormData();
        form.append('id', this.state.fileId);
        form.append('file', this.fileInput.current.files[0]);
        // eslint-disable-next-line no-undef
        axios.put('/api/verify', form,
            {
                headers:
                {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res =>
            { /* If the response status is 200, render ValidateSuccess */
                console.log(res.data);
                if(res.status === 200 && 'verifySuccess' in res.data)
                {
                    if(res.data.verifySuccess)
                    {
                        this.props.OnDisplayChange('validateSuccess');
                    }
                    else
                    {
                        this.props.OnDisplayChange('validateFailure');
                    }
                }
                else
                {
                    this.props.OnDisplayChange('ValidateError');
                }
            })
            .catch(() =>
            { // If the response was outside of 2xx, render ValidateError
                this.props.OnDisplayChange('ValidateError');
            });
    }
    // Changes the selected file Id whenever a dropdown option is selected
    HandleDropDownChange(event)
    {
        this.setState({fileId: event.target.value});
    }
    // Runs on component load to get the list of currently anchored documents
    componentDidMount()
    {
        // Make a get request to get the list of documents that are anchored
        if(reRenderValidate == true)
        {
            //console.log('did mount');
            // eslint-disable-next-line no-undef
            axios.get('/api/list')
            // Then map the documents into option elements for a dropdown menu
            .then(res =>
            {
                reRenderValidate = false;
                const documentJSON = res.data;
                this.setState({documentDropDown: documentJSON.map((e, key) =>
                {
                    return (
                        <option key={key} value={e._id}>[{e._id}] {e.documentName}</option>
                    );
                }
                )});
                if (res.data.length > 0)
                {
                    this.setState({fileId: res.data[0].id});
                }
            })
            .catch(error =>
            {
                //Do Something
                console.error('There was an error getting the list of documents\n', error);
            });
        }
    }
    // Temp fix to get new list data
    componentDidUpdate()
    {
        // Make a get request to get the list of documents that are anchored
        if (reRenderValidate == true)
        {
            //console.log("did update");
            reRenderValidate = false;
            // eslint-disable-next-line no-undef
            axios.get('/api/list')
            // Then map the documents into option elements for a dropdown menu
            .then(res =>
            {
                const documentJSON = res.data;
                this.setState({documentDropDown: documentJSON.map((e, key) =>
                {
                    return (
                        <option key={key} value={e._id}>[{e._id}] {e.documentName}</option>
                    );
                }
                )});
                if (res.data.length > 0)
                {
                    this.setState({fileId: res.data[0].id});
                }
            })
            .catch(error =>
            {
                //Do Something
                console.error('There was an error getting the list of documents\n', error);
            });
        }
    }
    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Select the file to validate against:{'\n'}
                    <select value={this.state.fileId} onChange={this.handleDropDownChange}>
                        {this.state.documentDropDown}
                    </select>
                </label>
                <br></br>
                <label>Upload the file you wish to validate:{'\n'}
                    <input type="file" ref={this.fileInput} />
                </label>
                <br></br>
                <button type="submit">Validate</button>
            </form>
        );
    }
}
ValidateForm.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Form for uploading documents to be anchored */}
// eslint-disable-next-line no-undef
class AnchorForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            fileName: '',
        };
        this.handleChange = this.HandleChange.bind(this);
        this.handleSubmit = this.HandleSubmit.bind(this);
        // eslint-disable-next-line no-undef
        this.fileInput = React.createRef();
    }

    HandleChange(event)
    {
        this.setState({fileName: event.target.value});
    }

    /* When form is submitted, this function runs to alert the user
    that they have uploaded a file, and sends the file to the server with an
    axios request*/
    HandleSubmit(event)
    {
        event.preventDefault();
        this.setState({uploadedFile: this.fileInput.current.files[0]});
        console.log(this.fileInput.current.files[0]);
        // Upload the file and then log the return status and change display
        const form = new FormData();
        form.append('name', this.state.fileName);
        form.append('file', this.fileInput.current.files[0]);
        // eslint-disable-next-line no-undef
        axios.post('/api/upload', form,
            {
                headers:
                {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res =>
            { /* If the response status is 200, render AnchorSucess */
                console.log(res.status);
                if(res.status == '200')
                {
                    this.props.OnDisplayChange('anchorSuccess');
                }
            })
            .catch(error =>
            { // If the response was outside of 2xx, render AnchorFailure
                if(error.response)
                {
                    this.props.OnDisplayChange('anchorFailure');
                }
            });
    }
    // Displays a form for uploading a file and entering a custom file name
    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>File name:
                    <input type="text" value={this.state.fileName} onChange={this.handleChange} />
                </label>
                <br></br>
                <label>File to be uploaded:
                    <input type="file" ref={this.fileInput} />
                </label>
                <br></br>
                <button type="submit">Upload</button>
            </form>
        );
    }
}
AnchorForm.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Default rendered component, allows a user to upload a document either for
validation against an existing anchored document, or to anchor new document */}
// eslint-disable-next-line no-undef
class AnchorValidate  extends React.Component
{
    render()
    {
        return (
            <div>
                <div className="anchor">
                    <h1>Anchor</h1>
                    {/* Placeholder text */}
                    <p>Upload a document here and enter a custom name for it. The
                    document will be anchored on the blockchain for future validations.</p>
                    <AnchorForm OnDisplayChange={this.props.OnDisplayChange} />
                </div>

                <div className="validate">
                    <h1>Validate</h1>
                    {/* Placeholder text */}
                    <p>Upload a document here to validate it.</p>
                    {/* Requires JS for upload functionality */}
                    <ValidateForm OnDisplayChange={this.props.OnDisplayChange} />
                </div>
            </div>
        );
    }
}
AnchorValidate.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Renders on page if an uploaded document was succesfully anchored */}
// eslint-disable-next-line no-undef
class AnchorSuccess extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.HandleClick.bind(this);
    }
    HandleClick()
    {
        this.props.OnDisplayChange('anchorValidate');
    }
    render()
    {
        return (
            <div className="anchorSuccess">
                <h6>Upload Successful</h6>
                <p>
                    Your document has been successfully uploaded, future attempts to
                    validate this file will be successful.
                </p>
                <button onClick={this.handleClick}>Anchor Another Document</button>
            </div>
        );
    }
}
AnchorSuccess.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Renders on page if an uploaded document could not be anchored */}
// eslint-disable-next-line no-undef
class AnchorFailure extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.HandleClick.bind(this);
    }
    HandleClick()
    {
        this.props.OnDisplayChange('anchorValidate');
    }
    render()
    {
        return (
            <div className="anchorFailure">
                <h6>Upload Failed</h6>
                <p>
                    Your document could not be uploaded, make sure that you attached a
                    file and entered a name for it. If you still have problems,
                    contact your system administrator.
                </p>
                <button onClick={this.handleClick}>Try Again</button>
            </div>
        );
    }
}
AnchorFailure.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Renders on page if uploaded document was succesfully validated */}
// eslint-disable-next-line no-undef
class ValidateSuccess extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.HandleClick.bind(this);
    }
    HandleClick()
    {
        this.props.OnDisplayChange('anchorValidate');
    }
    render()
    {
        return (
            <div className="validateSuccess">
                <h6>Validation Successful</h6>
                <p>Your document is valid</p>
                <button onClick={this.handleClick}>Validate Another Document</button>
            </div>
        );
    }
}
ValidateSuccess.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Renders on page if the uploaded document could not be validated */}
// eslint-disable-next-line no-undef
class ValidateFailure extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.HandleClick.bind(this);
    }
    HandleClick()
    {
        this.props.OnDisplayChange('anchorValidate');
    }
    render()
    {
        return (
            <div className="validateFailure">
                <h6>Document is Invalid</h6>
                <p>
                    Sorry, we couldn&apos;t validate your document. Your file may never have
                    been uploaded to the validation system, or may be a doctored form of
                    the true document
                </p>
                <button onClick={this.handleClick}>Try Again</button>
            </div>
        );
    }
}
ValidateFailure.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* Renders on page if uploaded document was succesfully validated */}
// eslint-disable-next-line no-undef
class ValidateError extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.HandleClick.bind(this);
    }
    HandleClick()
    {
        this.props.OnDisplayChange('anchorValidate');
    }
    render()
    {
        return (
            <div className="ValidateError">
                <h1>Validation Error</h1>
                <p>There was an error validating your document</p>
                <button onClick={this.handleClick}>Return to Homepage</button>
            </div>
        );
    }
}
ValidateError.propTypes =
{
    // eslint-disable-next-line no-undef
    OnDisplayChange: PropTypes.func,
};

{/* A component which explains how the document anchoring system works */}
// eslint-disable-next-line no-undef
class TechnologyExplanation extends React.Component
{
    render()
    {
        return (
            <div className="technologyExplanation">
                <h1>How it works</h1>
                <p>
                    This validation system utilises the Hedera Hasgraph blockchain to
                    validate documents, allowing users to be sure that their file is the
                    true, undoctored form of the document.
                </p>
                <p>
                    Upon a document being uploaded, the system stores the document and
                    generates a [Hash technology] hash from it. It then uses Hedera
                    APIs to anchor this hash on the blockchain. In the future, when the same
                    file is uploaded to the validation section, the system generates a
                    hash again, and checks if this same hash exists on the blockchain. If
                    so, the document is valid. If not, the file has either not been
                    uploaded to the system before, or the document is invalid.
                </p>
            </div>
        );
    }
}

{/* Main component which renders the correct sub-component based on its state */}
// eslint-disable-next-line no-undef
class AnchorWrapper extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            display: 'anchorValidate',
        };
        this.handleDisplayChange = this.handleDisplayChange.bind(this);
    }

    /* Called by sub-components. Changes the sub-component rendered by Main,
    depending on the result of certain user actions */
    handleDisplayChange(toBeDisplayed)
    {
        this.setState({display: toBeDisplayed});
    }

    render()
    {
        // Check the state to determine which div to render
        switch(this.state.display)
        {
        case 'anchorSuccess':
            return (
                <div>
                    <AnchorSuccess OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
        case 'anchorFailure':
            return (
                <div>
                    <AnchorFailure OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
            //  Default state is displaying a validate and anchor div side by side
        default:
            return (
                <div>
                    <AnchorForm OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
        }
    }
}

{/* Main component which renders the correct sub-component based on its state */}
// eslint-disable-next-line no-undef
class ValidateWrapper extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            display: 'anchorValidate',
        };
        this.handleDisplayChange = this.handleDisplayChange.bind(this);
    }

    /* Called by sub-components. Changes the sub-component rendered by Main,
    depending on the result of certain user actions */
    handleDisplayChange(toBeDisplayed)
    {
        this.setState({display: toBeDisplayed});
    }

    render()
    {
        // Check the state to determine which div to render
        switch(this.state.display)
        {
        case 'validateSuccess':
            return (
                <div>
                    <ValidateSuccess OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
        case 'validateFailure':
            return (
                <div>
                    <ValidateFailure OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
            //  Default state is displaying a validate and anchor div side by side
        default:
            return (
                <div>
                    <ValidateForm OnDisplayChange={this.handleDisplayChange} />
                </div>
            );
        }
    }
}

function ReRenderValidate()
{
    //console.log("Rerender set to true");
    reRenderValidate = true;
    let validateContainer = document.querySelector('#validatemodbody');
    // eslint-disable-next-line no-undef
    ReactDOM.render(<ValidateWrapper />, validateContainer);
}

let anchorContainer = document.querySelector('#anchormodbody');
// eslint-disable-next-line no-undef
ReactDOM.render(<AnchorWrapper />, anchorContainer);
let validateContainer = document.querySelector('#validatemodbody');
// eslint-disable-next-line no-undef
ReactDOM.render(<ValidateWrapper />, validateContainer);
