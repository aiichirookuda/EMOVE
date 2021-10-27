$(function () {
  $('.alert').hide();

  const selectorArray = [
    '#typeSelect',
    '#name',
    '#email',
    '#verification',
    '#inquiry',
  ];

  $('button[type="submit"]').click(() => {
    let sendFlag = true;

    selectorArray.map((selector) => {
      !$(selector).val()
        ? ($(`${selector} + .alert`).show(), (sendFlag = false))
        : $(`${selector} + .alert`).hide();
    });

    $('#email').val() !== $('#verification').val()
      ? ($(`#verification + .alert`).show(), (sendFlag = false))
      : $(`#verification + .alert`).hide();

    return sendFlag === false
      ? (alert('エラー：入力内容を確認してください'), false)
      : alert('お問い合わせを受け付けました');
  });
});
