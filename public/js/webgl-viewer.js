/* global $, OBJ, glMatrix */

$(document).ready(function () {
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl2", { alpha: true, preserveDrawingBuffer: true });

    const container = document.getElementById("canvas-container");

    if (!gl) {
        helpers.showToast("Unable to initialize WebGL2. WebGL2 not supported by your browser.", 'error');

        return;
    }

    // Shaders
    const vsSource = `#version 300 es
        layout(location = 0) in vec3 aVertexPosition;
        layout(location = 1) in vec3 aNormal;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        out vec3 vNormal;
        out vec3 vLightDir;

        void main(void) {
            vec4 worldPosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
            vNormal = mat3(uModelViewMatrix) * aNormal;
            vLightDir = vec3(0.0, 0.0, 1.0);
            gl_Position = uProjectionMatrix * worldPosition;
        }
    `;

    const fsSource = `#version 300 es
        precision highp float;

        in vec3 vNormal;
        in vec3 vLightDir;

        uniform float uAmbientIntensity;

        out vec4 fragColor;

        void main(void) {
            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vLightDir);

            float diffuse = max(dot(normal, lightDir), 0.0);

            float intensity = uAmbientIntensity + (1.0 - uAmbientIntensity) * diffuse;
            vec3 baseColor = vec3(0.2, 0.8, 0.2);
            fragColor = vec4(intensity * baseColor, 1.0);
        }
    `;

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        helpers.showToast("Unable to initialize shader program.", 'error');

        return;
    }

    gl.useProgram(shaderProgram);

    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    const uAmbientIntensity = gl.getUniformLocation(shaderProgram, "uAmbientIntensity");
    const uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection");

    gl.uniform3fv(uLightDirection, glMatrix.vec3.fromValues(0.0, 0.0, -1.0));

    let ambientIntensity = 0.3;
    gl.uniform1f(uAmbientIntensity, ambientIntensity);

    const mat4 = glMatrix.mat4;
    const projectionMatrix = mat4.create();

    let modelViewMatrix = mat4.create();
    let vao = null;
    let currentMesh = null;

    const camera = {
        position: [0, 0, -6],
        rotation: [0, 0],
        zoom: 1,
    };

    function updateModelViewMatrix() {
        modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, camera.position[2] * camera.zoom]);

        mat4.rotateX(modelViewMatrix, modelViewMatrix, camera.rotation[0]);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, camera.rotation[1]);

        mat4.translate(modelViewMatrix, modelViewMatrix, [camera.position[0], camera.position[1], 0]);

        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
    }

    $("#ambientSlider").on("input", function () {
        ambientIntensity = parseFloat(this.value);
        gl.uniform1f(uAmbientIntensity, ambientIntensity);
        drawScene();
    });


    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        updateModelViewMatrix();

        gl.uniform1f(uAmbientIntensity, ambientIntensity);

        if (vao) {
            gl.bindVertexArray(vao);

            const count = currentMesh?.indexCount || 36;

            gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);
        }
    }

    function loadShader(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            helpers.showToast('Shader compile error: ' + gl.getShaderInfoLog(shader), 'error');

            gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);

    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    const resizeObserver = new ResizeObserver(() => {
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        gl.viewport(0, 0, canvas.width, canvas.height);

        mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);

        gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        drawScene();
    });

    resizeObserver.observe(container);

    function createCubeVAO() {
        const positions = new Float32Array([
            -1, -1,  1,  1, -1,  1,  1,  1,  1,  -1,  1,  1, // front
            -1, -1, -1, -1,  1, -1, 1,  1, -1,  1, -1, -1, // back
            -1,  1, -1, -1,  1,  1, 1,  1,  1,  1,  1, -1, // top
            -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, // bottom
            1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, // right
            -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1 // left
        ]);

        const indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9,10, 8,10,11,
            12,13,14,12,14,15,
            16,17,18,16,18,19,
            20,21,22,20,22,23
        ]);

        vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const posBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        const indexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindVertexArray(null);
    }

    let isDragging = false;
    let lastMouse = [0, 0];

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouse = [e.clientX, e.clientY];
    });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - lastMouse[0];
        const dy = e.clientY - lastMouse[1];

        camera.rotation[1] += dx * 0.01;
        camera.rotation[0] += dy * 0.01;
        lastMouse = [e.clientX, e.clientY];

        drawScene();
    });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();

        camera.zoom *= e.deltaY > 0 ? 1.1 : 0.9;

        drawScene();
    });

    $('#rotateBtn').click(() => {
        camera.rotation[1] += 0.1;

        drawScene();
    });

    $('#resetCameraBtn').click(() => {
        camera.position = [0, 0, -6];
        camera.rotation = [0, 0];
        camera.zoom = 1;

        drawScene();
    });

    $('#saveCameraBtn').click(() => {
        const state = {
            position: camera.position,
            rotation: camera.rotation,
            zoom: camera.zoom
        };

        localStorage.setItem('cameraState', JSON.stringify(state));

        helpers.showToast('Camera state saved.');
    });

    $('#restoreCameraBtn').click(() => {
        const stateJSON = localStorage.getItem('cameraState');

        if (!stateJSON) {
            helpers.showToast('No saved camera state found.', 'error');

            return;
        }

        try {
            const state = JSON.parse(stateJSON);

            camera.position = state.position || [0, 0, -6];
            camera.rotation = state.rotation || [0, 0];
            camera.zoom = state.zoom || 1;

            drawScene();
        } catch (e) {
            helpers.showToast('Failed to restore camera state.', 'error');
        }
    });

    $('#uploadForm').on('dragover dragenter', e => {
        e.preventDefault();

        $('#uploadForm').addClass('ring-2 ring-blue-400 bg-blue-50');
    }).on('dragleave drop', () => {
        $('#uploadForm').removeClass('ring-2 ring-blue-400 bg-blue-50');
    }).on('drop', function (e) {
        e.preventDefault();

        const files = e.originalEvent.dataTransfer.files;

        if (files.length > 0) {
            $('#modelFile')[0].files = files;

            // Preventing automatic upload
            // $('#uploadForm').submit();

            alert("File ready to upload. Click the Upload button to continue!");
        }
    });

    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();

        const fileInput = $('#modelFile')[0];

        if (!fileInput.files.length) {
            helpers.showToast('Please select a .obj file.', 'error');

            return;
        }

        const formData = new FormData();

        formData.append('model_file', fileInput.files[0]);

        $.ajaxSetup({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
        });

        helpers.showLoader(true);

        $.ajax({
            url: '/models/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                const model = response.model;
                const option = $('<option>')
                    .val(model.id)
                    .text(model.name)
                    .attr('data-files', JSON.stringify(model.files))
                    .prop('selected', true);

                $('#modelSelector').append(option).trigger('change');

                helpers.showToast('Upload successful!');
            },
            error: function (e) {
                helpers.showToast('Upload failed: ' + (e.responseJSON?.message || 'Unknown error'), 'error');
            },
            complete: function () {
                helpers.showLoader(false);
            }
        });
    });

    function loadOBJModel(url) {
        helpers.showLoader(true);

        $.get(url, function (data) {
            const mesh = new OBJ.Mesh(data);

            OBJ.initMeshBuffers(gl, mesh);
            currentMesh = mesh;
            currentMesh.indexCount = mesh.indexBuffer.numItems || mesh.indices.length;

            vao = gl.createVertexArray();

            gl.bindVertexArray(vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
            gl.enableVertexAttribArray(1);
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
            gl.bindVertexArray(null);

            drawScene();

            logInteraction('load', { model_url: url });
        }, 'text').fail(() => {
            helpers.showToast('Failed to load the model from the server.', 'error');
        }).always(() => {
            helpers.showLoader(false);
        });
    }

    function logInteraction(type, data = {}) {
        $.ajax({
            url: '/api/log-interaction',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                event_type: type,
                event_data: data
            }),
        });
    }

    $('#screenshotBtn').click(() => {
        helpers.saveScreenshot(canvas);
    });

    $('#modelSelector').on('change', function (e) {
        const selected = e.target.selectedOptions[0];

        if (!selected) return;

        const file = JSON.parse(selected.dataset.files || null);
        const path = '/storage/models/' + file[0];

        loadOBJModel(path);
    });

    // Initialize
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    createCubeVAO();
    drawScene();
});
