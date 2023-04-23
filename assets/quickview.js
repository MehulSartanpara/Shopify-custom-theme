//Quick View
$(document).ready(function() {
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
        quickView();
    });
});

function quickView() {
    $(".quick-view").click(function() {
        if ($('#quick-view').length == 0) {
            $("body").append('<div id="quick-view"></div>');
        }
        var product_handle = $(this).data('handle');
        $('#quick-view').addClass(product_handle);
        jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
            var title = product.title;
            var type = product.type;
            var price = 0;
            var original_price = 0;
            var desc = product.description;
            var images = product.images;
            var variants = product.variants;
            var options = product.options;
            var url = '/products/' + product_handle;
          
            $('.qv-product-title').text(title);
            $('.qv-product-type').text(type);
            $('.qv-product-description').html(desc);
            $('.view-product').attr('href', url);
            var imageCount = $(images).length;
            $(images).each(function(i, image) {
                if (i == imageCount - 1) {
                    var image_embed = '<div><img class="lazy2" src="' + image + '"></div>';
                    image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
                    $('.qv-product-images').append(image_embed);
                    $('.qv-product-images').slick({
                        'dots': true,
                        'arrows': false,
                        'respondTo': 'min',
                        'useTransform': false
                    }).css('opacity', '1');
                } else {
                    image_embed = '<div><img class="lazy2" src="' + image + '"></div>';
                    image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
                    $('.qv-product-images').append(image_embed);
                }
            });
          
          
            // $(options).each(function(i, option) {
            //     var opt = option.name;
            //     var selectClass = '.option.' + opt.toLowerCase();
            //     $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
            //     $(option.values).each(function(i, value) {
            //         $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
            //     }); 
            // });

  

          let masterSelect ='<select id="product-select" name="id" class="master_select"></select>';
          $('.masterSelect').append(masterSelect);
         
           $(variants).each(function(i, option) {
             $('.masterSelect select').append('<option value="'+option.id+'" data-option-val="' + option.title + '">'+option.title+' </option>')
             $('.main-id').val(option.id);   
           });

          $(document).on('change','#product-select',function(){
              let val_new = $('#product-select').val();
              $('.main-id').val(val_new);
          });

          $(options).each(function(i, option) {
                var opt = option.name;
                var selectClass = '.option.' + opt.toLowerCase();
                $('.main--product---varients').append('<div class="options__text__val option-selection-' + opt.toLowerCase() + '"><span class="options__text option-' + i + ' option ' + opt.toLowerCase() + '">' + opt + '<br></span></div>');
                $(option.values).each(function(i,value) {
                    $('.option.' + opt.toLowerCase()).append('<input class="qv-radio-input" type="radio"  value="' + value + '" id="' + value + '" name=" '+ opt + ' "><label data-veriant-id="' + value + '" for="' + value + '" class="qv-radio-hide">' + value + '</label>');
                }); 
            });           

           $('.options__text__val').each(function(i,elem){
            $(this).find('input').first().trigger('click');
             $('#product-select').trigger('change')
           });
          
         $(document).on('click','.options__text__val label',function(){
            let variantTitle = [];
            let __this = $(this);
            setTimeout(function(){
              $('.options__text__val').each(function(){
                let opTitle = $(this).find(':checked').val();
                variantTitle.push(opTitle);
              }) 
                let finalString = variantTitle.join(' / ');
               $('#product-select option[data-option-val="'+finalString+'"]').prop('selected',true);
               $('#product-select').trigger('change')
             },100)
         

          });
         
            $(product.variants).each(function(i, v) {
                if (v.inventory_quantity == 0) {
                    $('.qv-add-button').prop('disabled', true).val('Sold Out');
                    $('.qv-add-to-cart').hide();
                    $('.qv-product-price').text('Sold Out').show();
                    return true
                } else {
                    price = parseFloat(v.price / 100).toFixed(2);
                    original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
                    $('.qv-product-price').text('₹ ' + price);
                    if (original_price > 0) {
                        $('.qv-product-original-price').text('₹ ' + original_price).show();
                    } else {
                        $('.qv-product-original-price').hide();
                    }
                    $('select.option-0').val(v.option1);
                    $('select.option-1').val(v.option2);
                    $('select.option-2').val(v.option3);
                    return false
                }
            });
        });
        $(document).on("change", "#quick-view select", function() {
            var selectedOptions = '';
            $('#quick-view select').each(function(i) {
                if (selectedOptions == '') {
                    selectedOptions = $(this).val();
                } else {
                    selectedOptions = selectedOptions + ' / ' + $(this).val();
                }
            });
            jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
                $(product.variants).each(function(i, v) {
                    if (v.title == selectedOptions) {
                        var price = parseFloat(v.price / 100).toFixed(2);
                        var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
                        var v_qty = v.inventory_quantity;
                        var v_inv = v.inventory_management;
                        $('.qv-product-price').text('₹ ' + price);
                        $('.qv-product-original-price').text('₹ ' + original_price);
                        if (v_inv == null) {
                            $('.qv-add-button').prop('disabled', false).val('Add to Cart');
                        } else {
                            if (v.inventory_quantity < 1) {
                                $('.qv-add-button').prop('disabled', true).val('Sold Out');
                            } else {
                                $('.qv-add-button').prop('disabled', false).val('Add to Cart');
                            }
                        }
                    }
                });
            });
        });
        $.fancybox({
            href: '#quick-view',
            maxWidth: 1040,
            maxHeight: 600,
            fitToView: true,
            width: '75%',
            height: '70%',
            autoSize: false,
            closeClick: false,
            openEffect: 'none',
            closeEffect: 'none',
            'beforeLoad': function() {
                var product_handle = $('#quick-view').attr('class');
                $(document).on("click", ".qv-add-button", function() {
                    var qty = $('.qv-quantity').val();
                    var selectedOptions = '';
                    var var_id = '';
                    $('#quick-view select').each(function(i) {

                        if (selectedOptions == '') {

                            selectedOptions = $(this).val();
                        } else {
                            selectedOptions = selectedOptions + ' / ' + $(this).val();
                        }
                    });
                    jQuery.getJSON('/products/' + product_handle + '.js', function(product) {
                        $(product.variants).each(function(i, v) {
                            if (v.title == selectedOptions) {
                                var_id = v.id;
                                processCart();
                            }
                        });
                    });
                    function processCart() {
                        jQuery.post('/cart/add.js', {
                                    quantity: qty,
                                    id: var_id
                                },
                                null,
                                "json"
                            ).done(function() {
                                $('.qv-add-to-cart-response').addClass('success').html('<span>' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
                            })
                            .fail(function($xhr) {
                                var data = $xhr.responseJSON;
                                $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
                            });
                    }
                });
                $('.fancybox-wrap').css('overflow', 'hidden !important');
            },
            'afterShow': function() {
                $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function() {
                    $('.qv-product-images').addClass('loaded');
                });
            },
            'afterClose': function() {
                $('#quick-view').removeClass().empty();
            }
        });
    });
};

$(window).resize(function() {
    if ($('#quick-view').is(':visible')) {
        $('.qv-product-images').slick('setPosition');
    }
});