<label for="modelSelector" class="block font-semibold text-white mt-4">Choose Uploaded Model:</label>
<select id="modelSelector" class="block w-full px-3 py-2 border rounded bg-white shadow">
    <option value="">-- Select Model --</option>
    @foreach ($models as $model)
        <option value="{{ $model->id }}" data-files='@json($model->files)'>
            {{ $model->name }}
        </option>
    @endforeach
</select>
