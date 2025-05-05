/* global $, OBJ, glMatrix */

$(document).ready(function () {
    const canvas = document.getElementById("glcanvas");
    const gl = canvas.getContext("webgl2");
    const container = document.getElementById("canvas-container");

    if (!gl) {
        showError("Unable to initialize WebGL2. Your browser or machine may not support it.");

        return;
    }

    // WebGL2 shaders (GLSL ES 3.00)
    const vsSource = `#version 300 es
        in vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    const fsSource = `#version 300 es
        precision highp float;
        out vec4 outColor;
        void main() {
            outColor = vec4(0.2, 0.8, 0.2, 1.0);
        }
    `;

    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    const uProjectionMatrix = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
    const uModelViewMatrix = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");

    const mat4 = glMatrix.mat4;
    const projectionMatrix = mat4.create();


    let modelViewMatrix = mat4.create();
    let angle = 0;
    let defaultCubeRendered = false;
    let currentMesh = null;

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        gl.viewport(0, 0, canvas.width, canvas.height);

        // Updating the projection matrix
        mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
        gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

        // Redrawing the scene
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (currentMesh) {
            gl.bindBuffer(gl.ARRAY_BUFFER, currentMesh.vertexBuffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vertexPosition);
            gl.drawArrays(gl.TRIANGLES, 0, currentMesh.vertexBuffer.numItems || currentMesh.vertexBuffer.length / 3);
        } else {
            drawDefaultCube();
        }
    }

    window.addEventListener("resize", resizeCanvas);

    // Compiling shaders
    function loadShader(type, source) {
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            showError('Shader compile error: ' + gl.getShaderInfoLog(shader));

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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Default Cube Rendering
    function drawDefaultCube() {
        const positions = [
            // Front
            -1, -1,  1,  1, -1,  1,  1,  1,  1,
            -1, -1,  1,  1,  1,  1, -1,  1,  1,

            // Back
            -1, -1, -1, -1,  1, -1,  1,  1, -1,
            -1, -1, -1,  1,  1, -1,  1, -1, -1,

            // Top
            -1,  1, -1, -1,  1,  1,  1,  1,  1,
            -1,  1, -1,  1,  1,  1,  1,  1, -1,

            // Bottom
            -1, -1, -1,  1, -1, -1,  1, -1,  1,
            -1, -1, -1,  1, -1,  1, -1, -1,  1,

            // Right
            1, -1, -1,  1,  1, -1,  1,  1,  1,
            1, -1, -1,  1,  1,  1,  1, -1,  1,

            // Left
            -1, -1, -1, -1, -1,  1, -1,  1,  1,
            -1, -1, -1, -1,  1,  1, -1,  1, -1
        ];

        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(vertexPosition);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

        defaultCubeRendered = true;
    }

    // Rotation handler
    $('#rotateBtn').click(function () {
        angle += 0.1;

        mat4.identity(modelViewMatrix);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -6]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [0, 1, 0]);

        gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (currentMesh) {
            gl.bindBuffer(gl.ARRAY_BUFFER, currentMesh.vertexBuffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, currentMesh.vertexBuffer.numItems || currentMesh.vertexBuffer.length / 3);
        } else {
            drawDefaultCube();
        }
    });

    // Drag&Drop
    const dropZone = $('#uploadForm');

    dropZone.on('dragover', function (e) {
        e.preventDefault();

        dropZone.addClass('ring-2 ring-blue-400 bg-blue-50');
    }).on('dragleave drop', function () {
        dropZone.removeClass('ring-2 ring-blue-400 bg-blue-50');
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

    // Upload form submission
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
            url: '/upload-model',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                loadOBJModel(response.path);
            },
            error: function (e) {
                showError('Upload failed: ' + e.responseJSON.message);
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

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            gl.enableVertexAttribArray(vertexPosition);

            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, mesh.vertexBuffer.numItems || mesh.vertexBuffer.length / 3);

            defaultCubeRendered = false;
        }, 'text').fail(function () {
            showError('Failed to load the model from the server.');
        }).always(function () {
            showLoading(false);
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

    // Initialize default cube
    drawDefaultCube();

    resizeCanvas();
});

