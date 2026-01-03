const API_BASE = '/_ui/api';

const fileTreeElement = document.getElementById('file-tree');
const templateListElement = document.getElementById('template-list');
const editorElement = document.getElementById('editor');
const editorPathElement = document.getElementById('editor-path');
const saveButton = document.getElementById('save-btn');
const addFileButton = document.getElementById('add-file-btn');
const addFolderButton = document.getElementById('add-folder-btn');

let currentEditingFilePath = null;

// --- API Calls ---
async function fetchFiles() {
    const response = await fetch(`${API_BASE}/files`);
    if (!response.ok) {
        throw new Error('Failed to fetch files');
    }
    return response.json();
}

async function fetchFileContent(path) {
    const response = await fetch(`${API_BASE}/file?path=${encodeURIComponent(path)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch file content');
    }
    const data = await response.json();
    return data.content;
}

async function saveFileContent(path, content) {
    const response = await fetch(`${API_BASE}/file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to save file');
    }
    return response.json();
}

async function deleteFileOrFolder(path) {
    const response = await fetch(`${API_BASE}/file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete file/folder');
    }
    return response.json();
}

async function fetchTemplates() {
    const response = await fetch(`${API_BASE}/templates`);
    if (!response.ok) {
        throw new Error('Failed to fetch templates');
    }
    return response.json();
}

async function applyTemplate(name) {
    const response = await fetch(`${API_BASE}/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to apply template');
    }
    return response.json();
}

// --- UI Rendering ---
function renderFileTree(files, parentElement) {
    parentElement.innerHTML = ''; // Clear existing tree
    const ul = document.createElement('ul');
    files.forEach(item => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = item.name;
        span.classList.add(item.type);
        span.dataset.path = item.path;

        if (item.type === 'file') {
            span.addEventListener('click', async () => {
                try {
                    const content = await fetchFileContent(item.path);
                    editorElement.value = content;
                    editorPathElement.textContent = item.path;
                    currentEditingFilePath = item.path;
                } catch (error) {
                    alert('Error loading file: ' + error.message);
                }
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'x';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.style.backgroundColor = '#dc3545';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '3px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent file selection
                if (confirm(`Are you sure you want to delete ${item.path}?`)) {
                    try {
                        await deleteFileOrFolder(item.path);
                        alert('Deleted successfully');
                        loadAndRenderAll();
                    } catch (error) {
                        alert('Error deleting: ' + error.message);
                    }
                }
            });
            li.appendChild(span);
            li.appendChild(deleteBtn);
        } else {
            // Folder
            li.appendChild(span);
            if (item.children && item.children.length > 0) {
                renderFileTree(item.children, li);
            }
        }
        ul.appendChild(li);
    });
    parentElement.appendChild(ul);
}


function renderTemplates(templates) {
    templateListElement.innerHTML = '';
    if (templates.length === 0) {
        templateListElement.textContent = 'No templates available.';
        return;
    }
    templates.forEach(template => {
        const div = document.createElement('div');
        div.classList.add('template-item');
        div.textContent = template;
        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.style.marginLeft = '10px';
        applyBtn.style.backgroundColor = '#28a745';
        applyBtn.style.color = 'white';
        applyBtn.style.border = 'none';
        applyBtn.style.borderRadius = '3px';
        applyBtn.style.cursor = 'pointer';
        applyBtn.addEventListener('click', async () => {
            if (confirm(`Applying template '${template}' will overwrite existing mock files. Are you sure?`)) {
                try {
                    await applyTemplate(template);
                    alert(`Template '${template}' applied successfully!`);
                    loadAndRenderAll();
                } catch (error) {
                    alert('Error applying template: ' + error.message);
                }
            }
        });
        div.appendChild(applyBtn);
        templateListElement.appendChild(div);
    });
}

async function loadAndRenderAll() {
    try {
        const files = await fetchFiles();
        renderFileTree(files, fileTreeElement);
    } catch (error) {
        fileTreeElement.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
    try {
        const templates = await fetchTemplates();
        renderTemplates(templates);
    } catch (error) {
        templateListElement.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// --- Event Listeners ---
saveButton.addEventListener('click', async () => {
    if (currentEditingFilePath) {
        try {
            await saveFileContent(currentEditingFilePath, editorElement.value);
            alert('File saved successfully!');
            loadAndRenderAll();
        } catch (error) {
            alert('Error saving file: ' + error.message);
        }
    } else {
        alert('No file selected to save.');
    }
});

addFileButton.addEventListener('click', async () => {
    const newFileName = prompt('Enter new file path (e.g., users/new.json):');
    if (newFileName) {
        try {
            await saveFileContent(newFileName, ''); // Create empty file
            alert('File created successfully!');
            loadAndRenderAll();
            editorElement.value = '';
            editorPathElement.textContent = newFileName;
            currentEditingFilePath = newFileName;
        } catch (error) {
            alert('Error creating file: ' + error.message);
        }
    }
});

addFolderButton.addEventListener('click', async () => {
    const newFolderPath = prompt('Enter new folder path (e.g., new_folder):');
    if (newFolderPath) {
        // To create a folder, we create an empty file inside it
        // fs-extra's outputFile will create parent directories if they don't exist
        const dummyFilePath = `${newFolderPath}/.gitkeep`; 
        try {
            await saveFileContent(dummyFilePath, ''); 
            alert('Folder created successfully!');
            loadAndRenderAll();
        } catch (error) {
            alert('Error creating folder: ' + error.message);
        }
    }
});

// Initial load
loadAndRenderAll();
