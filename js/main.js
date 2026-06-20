// マスタデータ
let pokemonMaster = [];
let moveMaster = [];
let natureMaster = [];

// ページの読み込み後にデータを読み込む
document.addEventListener( 'DOMContentLoaded', initialize);

/**
 * 初期化処理を行います。
 */
function initialize() {
    // マスタデータの読み込み
    loadMasterData();
}

/**
 * マスタデータを読み込みます。
 */
async function loadMasterData() {
    let pokemonResponse, moveResponse, natureResponse;

    // フェッチ
    try {
        [pokemonResponse, moveResponse, natureResponse] = await Promise.all([
            fetch('./data/pokemon.json'),
            fetch('./data/moves.json'),
            fetch('./data/natures.json')
        ]);
        if ( !pokemonResponse.ok) {
            throw new Error( `pokemon.json の取得に失敗しました。（ステータス: ${pokemonResponse.status}）`);
        }
        if ( !moveResponse.ok) {
            throw new Error( `moves.json の取得に失敗しました。（ステータス: ${moveResponse.status}）`);
        }
        if ( !natureResponse.ok) {
            throw new Error( `natures.json の取得に失敗しました。（ステータス: ${natureResponse.status}）`);
        }
    } catch ( fetchError) {
        console.error( fetchError.message);
        return;
    }

    // パース
    try {
        pokemonMaster = await pokemonResponse.json();
    } catch ( parseError) {
        console.error( `pokemon.json の解析に失敗しました。（エラー: ${parseError.message}）`);
        return;
    }
    try {
        moveMaster = await moveResponse.json();
    } catch ( parseError) {
        console.error( `moves.json の解析に失敗しました。（エラー: ${parseError.message}）`);
        return;
    }
    try {
        natureMaster = await natureResponse.json();
        populateNatureSelects();
    } catch ( parseError) {
        console.error( `natures.json の解析に失敗しました。（エラー: ${parseError.message}）`);
        return;
    }

    console.log( 'マスタデータを読み込みました。');
}

/**
 * 性格のプルダウンを作成します。
 */
function populateNatureSelects() {
    const attackerNatureSelect = document.getElementById( 'atk-nature');
    const defenderNatureSelect = document.getElementById( 'def-nature');

    if ( !attackerNatureSelect || !defenderNatureSelect) {
        return;
    }

    attackerNatureSelect.innerHTML = '';
    defenderNatureSelect.innerHTML = '';

    natureMaster.forEach( nature => {
        const optionHtml = document.createElement( 'option');
        optionHtml.value = nature.name;
        optionHtml.textContent = nature.name;
        attackerNatureSelect.appendChild( optionHtml.cloneNode(true));
        defenderNatureSelect.appendChild( optionHtml);
    });
}
