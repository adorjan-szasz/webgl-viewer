/* global $, OBJ, glMatrix */

$(document).ready(function () {
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl2");

    const container = document.getElementById("canvas-container");

    if (!gl) {
        showError("Unable to initialize WebGL2. WebGL2 not supported by your browser.");

        return;
    }

    // Shaders
    const vsSource = `#version 300 es
        layout(location = 0) in vec3 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        }
    `;

    const fsSource = `#version 300 es
        precision highp float;
        out vec4 fragColor;
        void main(void) {
            fragColor = vec4(0.2, 0.8, 0.2, 1.0);
        }
    `;

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        showError("Unable to initialize shader program.");

        return;
    }

    gl.useProgram(shaderProgram);

    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");

    const mat4 = glMatrix.mat4;
    const projectionMatrix = mat4.create();


    let modelViewMatrix = mat4.create();
    let angle = 0;
    let vao = null;
    let currentMesh = null;

    // Resize using ResizeObserver
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

    // Compiling shaders
    function loadShader(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            showError('Shader compile error: ' + gl.getShaderInfoLog(shader));

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

    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [0, 1, 0]);

        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);

        if (vao) {
            gl.bindVertexArray(vao);

            const count = currentMesh?.indexCount || 36;

            gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);
        }
    }

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

    $('#rotateBtn').click(() => {
        angle += 0.1;

        drawScene();
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
            showError('Please select a .obj file.');

            return;
        }

        const formData = new FormData();

        formData.append('model_file', fileInput.files[0]);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        showLoading(true);

        $.ajax({
            url: '/models/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                loadOBJModel(response.path);
            },
            error: function (e) {
                showError('Upload failed: ' + (e.responseJSON?.message || 'Unknown error'));
            },
            complete: function () {
                showLoading(false);
            }
        });
    });

    function loadOBJModel(url) {
        showLoading(true);

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

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

            drawScene();
            gl.bindVertexArray(null);

            logInteraction('load', { model_url: url });
        }, 'text').fail(function () {
            showError('Failed to load the model from the server.');
        }).always(function () {
            showLoading(false);
        });
    }

    function logInteraction(type, data = {}) {
        // $.ajaxSetup({
        //     headers: {
        //         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        //     }
        // });

        $.ajax({
            url: '/api/log-interaction',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                event_type: type,
                event_data: data
            }),
            success: function () {
                console.log('Logged:', type);
            },
            error: function () {
                console.error('Failed to log interaction.');
            }
        });
    }

    function showLoading(show) {
        $('#loadingIndicator').toggleClass('hidden', !show);
    }

    function showError(message) {
        $('#errorMessage').text(message);
        $('#errorContainer').removeClass('hidden');
        setTimeout(() => $('#errorContainer').addClass('hidden'), 5000);
    }

    createCubeVAO();
    drawScene();
});

