
<script>	
	file_counter = 0;
	files.entries = [".."];
	files.entrytype = ["folder"];
	files.paths = [""];
</script>
<?php $item_iter = 0; ?>

@if((sizeof($files) > 0) || (sizeof($directories) > 0))

<div style="width:100%;">

  @foreach($items as $item)
  
  <?php $item_iter += 1; ?>
  <?php $item_name = $item->name; ?>
  <?php $thumb_src = $item->thumb; ?>
  <?php $item_path = $item->is_file ? $item->url : $item->path; ?>
    
  <div  id="item_{{ $item_iter }}" class="col-xs-6 col-sm-4 col-md-3 col-lg-2 img-row">
	

    <div id="item_{{ $item_iter }}_pic" class="square clickable {{ $item->is_file ? 'file' : 'folder'}}-item" data-id="{{ $item_path }}"  >
    </div>
    
    <div id="item_{{ $item_iter }}_name"class="caption text-center">
      <div class="btn-group">
        <button type="button" data-id="{{ $item_path }}" class="item_name btn btn-default btn-xs {{ $item->is_file ? 'file' : 'folder'}}-item">
          {{ $item_name }}
        </button>
        
        <div id="item_{{ $item_iter }}_buttons">
          <a href="javascript:rename('{{ $item_name }}')"> {{ Lang::get('laravel-filemanager::lfm.menu-rename') }}</a>
          @if($item->is_file)
          <a href="javascript:download('{{ $item_name }}')"> {{ Lang::get('laravel-filemanager::lfm.menu-download') }}</a>
          @if($thumb_src)
          <a href="javascript:fileView('{{ $item_path }}', '{{ $item->updated }}')"> {{ Lang::get('laravel-filemanager::lfm.menu-view') }}</a>
          @endif
          @endif
          <a href="javascript:trash('{{ $item_name }}')"> {{ Lang::get('laravel-filemanager::lfm.menu-delete') }}</a>
        </div>
        
        
        
      </div>
    </div>
	
	<script>
		files.entries.push( '{{ $item_name }}' );
		files.paths.push( '{{ $item_path }}' );
		files.entrytype.push( "{{ $item->is_file ? 'file' : 'folder'}}" );
    </script>
  </div>
  @endforeach
	
</div>

@else
<p>{{ Lang::get('laravel-filemanager::lfm.message-empty') }}</p>
@endif

<script>
	files_update();
</script>
