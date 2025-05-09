/* global $ */

import * as THREE from 'three';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/loaders/GLTFLoader.js';
import { ColladaLoader } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/loaders/ColladaLoader.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('threeCanvas');
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x202124);

    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

    const light = new THREE.AmbientLight(0xffffff, 0.8);

    scene.add(light);
    scene.add(new THREE.DirectionalLight(0xffffff, 1));

    const controls = new OrbitControls(camera, renderer.domElement);

    let currentModel;

    function loadModel(files) {
        return new Promise((resolve, reject) => {
            showLoader();

            if (currentModel) {
                scene.remove(currentModel);
                currentModel = null;
            }

            const basePath = '/storage/models/';
            const fileMap = Object.fromEntries(files.map(f => [f.split('.').pop().toLowerCase(), f]));

            try {
                if (fileMap.obj) {
                    if (fileMap.mtl) {
                        const mtlLoader = new MTLLoader();

                        mtlLoader.setPath(basePath);
                        mtlLoader.load(fileMap.mtl, (materials) => {
                            materials.preload();

                            const objLoader = new OBJLoader();

                            objLoader.setMaterials(materials);
                            objLoader.setPath(basePath);

                            objLoader.load(fileMap.obj, (obj) => {
                                currentModel = obj;
                                scene.add(obj);

                                hideLoader();
                                resolve();
                            }, undefined, (err) => {
                                hideLoader();
                                helpers.showToast('Failed to load OBJ model', 'error');
                                reject(err);
                            });
                        }, undefined, (err) => {
                            hideLoader();
                            helpers.showToast('Failed to load MTL material', 'error');
                            reject(err);
                        });
                    } else {
                        const objLoader = new OBJLoader();

                        objLoader.setPath(basePath);

                        objLoader.load(fileMap.obj, (obj) => {
                            currentModel = obj;
                            scene.add(obj);

                            hideLoader();
                            resolve();
                        }, undefined, (err) => {
                            hideLoader();
                            helpers.showToast('Failed to load OBJ model', 'error');
                            reject(err);
                        });
                    }
                } else if (fileMap.gltf || fileMap.glb) {
                    const loader = new GLTFLoader();

                    loader.load(basePath + (fileMap.gltf || fileMap.glb), (gltf) => {
                        currentModel = gltf.scene;
                        scene.add(gltf.scene);

                        hideLoader();
                        resolve();
                    }, undefined, (err) => {
                        hideLoader();
                        helpers.showToast('Failed to load GLTF/GLB model', 'error');
                        reject(err);
                    });
                } else if (fileMap.dae) {
                    const loader = new ColladaLoader();

                    loader.load(basePath + fileMap.dae, (dae) => {
                        currentModel = dae.scene;
                        scene.add(dae.scene);

                        hideLoader();
                        resolve();
                    }, undefined, (err) => {
                        hideLoader();
                        helpers.showToast('Failed to load DAE model', 'error');
                        reject(err);
                    });
                } else {
                    hideLoader();
                    const message = 'No supported 3D file format found';

                    helpers.showToast(message, 'error');
                    reject(message);
                }
            } catch (err) {
                hideLoader();
                helpers.showToast('Unexpected error while loading model', 'error');
                reject(err);
            }
        });
    }

    const uploadForm = document.getElementById('uploadModelForm');
    const fileInput = document.getElementById('model_files');

    uploadForm.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadForm.classList.add('drag-hover');
    });

    uploadForm.addEventListener('dragleave', () => {
        uploadForm.classList.remove('drag-hover');
    });

    uploadForm.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadForm.classList.remove('drag-hover');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
        }
    });

    $('#uploadModelForm').on('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax({
            url: '/three-viewer/upload',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val()
            },
            success: function (res) {
                if (res.success) {
                    const model = res.model;
                    const option = $('<option>')
                        .val(model.id)
                        .text(model.name)
                        .attr('data-files', JSON.stringify(model.files))
                        .prop('selected', true);

                    $('#modelSelector').append(option).trigger('change');

                    helpers.showToast('Upload successful!');
                }
            },
            error: function (err) {
                helpers.showToast('Upload failed. Please check your files.', 'error')
                console.error(err);
            }
        });
    });

    $('#model_files').on('change', function () {
        const files = Array.from(this.files).map(file => file.name);

        $('#file-names').html(files.join('<br>'));
    });

    $('#modelSelector').on('change', (e) => {
        const selected = e.target.selectedOptions[0];

        if (!selected) return;

        const files = JSON.parse(selected.dataset.files || '[]');

        loadModel(files)
            .then(() => helpers.showToast('Model loaded'))
            .catch(() => {});
    });

    function showLoader() {
        $('#loadingIndicator').removeClass('hidden');
    }

    function hideLoader() {
        $('#loadingIndicator').addClass('hidden');
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();

        renderer.render(scene, camera);
    }

    animate();
});
