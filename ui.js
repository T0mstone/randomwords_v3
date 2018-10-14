function def_prototype() {
    return {
        category() { return document.getElementById('category_def_prototype').innerHTML},
        syllable() { return  document.getElementById('syllable_def_prototype').innerHTML}
    };
}


function filter_list(l, f) {
    let res = [];
    for (let i in l) {
        if (f(l[i])) {
            res.push(l[i]);
        }
    }
    return res;
}


class UIv3 {
    constructor() {
        this.prot = def_prototype();
        this.filters = {
            letter: (x) => x.tagName == "INPUT" && x.name != "cat",
            div: (x) => x.tagName == "DIV",
            syllable_cat: (x) => x.tagName == "INPUT",
            sylcount: (x) => x.className !== undefined && x.className.includes('sylcount-item') && x.children[0].name !== "first"
        };
        this.f_onclick_on_sylcount = (curr) => curr.children[0];
    }

    enter_remove_mode(btn, filter_f, anim_class, f_onclick_on_what) {
        let par = btn.parentNode;
        let all = filter_list(par.children, filter_f);
        if (all.length === 0) {
            return all;
        }
        for (let i in all) {
            let curr = all[i];
            if (f_onclick_on_what !== undefined) {
                curr = f_onclick_on_what(curr);
            }
            curr.classList.add(anim_class);
            curr.onclick = () => {
                ui.exit_remove_mode(all[i], btn, filter_f, anim_class, f_onclick_on_what);
            };
        }
        btn.onclick = () => { return ui.exit_remove_mode(btn, btn, filter_f, anim_class, f_onclick_on_what); }
        btn.innerHTML = "x";
        return all;
    }

    exit_remove_mode(elt, btn, filter_f, anim_class, f_onclick_on_what) {
        let par = elt.parentNode;
        if (elt !== btn) {
            // Remove it if it's not the button (I don't want to remove the button)
            par.removeChild(elt);
        }
        btn.onclick = () => { return ui.enter_remove_mode(btn, filter_f, anim_class, f_onclick_on_what); }
        btn.innerHTML = "-";

        let all = filter_list(par.children, filter_f);
        for (let i in all) {
            let curr = all[i];
            if (f_onclick_on_what !== undefined) {
                curr = f_onclick_on_what(curr);
            }
            curr.classList.remove(anim_class);
            curr.onclick = undefined;
        }
        return elt;
    }

    add_letter_input(btn) {
        let div = btn.parentNode;
        let input_elt = document.createElement('input');
        input_elt.type = "string";
        input_elt.size = "2";
        input_elt.classList.add('letter');
        div.insertBefore(input_elt, btn);
        return input_elt;
    }

    add_category(btn) {
        let div = btn.parentNode;
        let categ_elt = document.createElement('div');
        categ_elt.classList.add('category_def');

        // categ_elt.innerHTML = "<input name=\"cat\" type=\"string\" size=\"3\" /> = " +
        //     "<button onclick=\"return ui.add_letter_input(this);\">+</button>" +
        //     "<button onclick=\"return ui.remove_last_letter_input(this);\">-</button>";
        categ_elt.innerHTML = this.prot.category();

        div.insertBefore(categ_elt, btn);
        return categ_elt;
    }

    add_syllable_cat(btn) {
        let div = btn.parentNode;
        let input_elt = document.createElement('input');
        input_elt.type = "string";
        input_elt.size = "4";
        input_elt.classList.add('syllable_cat');
        div.insertBefore(input_elt, btn);
        return input_elt;
    }

    add_syllable(btn) {
        let div = btn.parentNode;
        let syl_elt = document.createElement('div');
        syl_elt.classList.add('syllable_def');

        // syl_elt.innerHTML = "<input class=\"syllable_cat\" type=\"string\" size=\"4\" /> " +
        //     "<button onclick=\"return ui.add_syllable_cat(this);\">+</button> " +
        //     "<button onclick=\"return ui.remove_syllable_cat(this);\">-</button>";
        syl_elt.innerHTML = this.prot.syllable();

        div.insertBefore(syl_elt, btn);
        return syl_elt;
    }

    add_sylcount(btn) {
        let div = btn.parentNode;

        let sylcount_elt = document.createElement('input');
        sylcount_elt.type = "number";
        sylcount_elt.size = "4";
        sylcount_elt.classList.add('sylcount');
        sylcount_elt.min = "1";
        sylcount_elt.step = "1";
        sylcount_elt.value = "1";

        let br = document.createElement('br');
        let txt = document.createTextNode('or ');

        let parent_div = document.createElement('div');
        parent_div.classList.add('sylcount-item');

        let is_first = div.childNodes.length === 4;

        if (is_first) {
            sylcount_elt.name = "first";
        } else {
            parent_div.appendChild(txt);
        }
        parent_div.appendChild(sylcount_elt);
        parent_div.appendChild(br);

        div.insertBefore(parent_div, btn);
        return sylcount_elt;
    }

    remove_sylcount(btn) {
        let div = btn.parentNode;
        let br_to_remove = div.children[div.children.length - 3];
        let item_to_remove = div.children[div.children.length - 4];
        if (item_to_remove.name == 'first') {
            return
        }
        try {
            div.removeChild(br_to_remove);
        } catch {}
        try {
            let txt_to_remove = div.childNodes[div.childNodes.length - 5];
            div.removeChild(txt_to_remove);
        } catch {}
        try {
            div.removeChild(item_to_remove);
            return item_to_remove;
        } catch {}
    }

    clear_categories() {
        let c = document.getElementById('categories');
        while (document.getElementsByClassName('category_def').length !== 0) {
            c.removeChild(c.children[0]);
        }
    }

    clear_syllables() {
        let s = document.getElementById('syllables');
        while (document.getElementsByClassName('syllable_def').length !== 0) {
            s.removeChild(s.children[0]);
        }
    }

    clear_sylcounts() {
        let sc = document.getElementById('sylcount');
        while (sc.childNodes.length !== 4) {
            sc.removeChild(sc.childNodes[sc.childNodes.length - 5]);
        }

    }

    clear_all() {
        this.clear_categories();
        this.clear_syllables();
        this.clear_sylcounts();

        document.getElementById('rem_dbls').checked = false;
        document.getElementById('amount').value = 1;
    }

    custom_escape(s) {
        return s.replace(/@/g, '@0')
            .replace(/=/g, '@1')
            .replace(/\//g, '@2')
            .replace(/;/g, '@3')
            .replace(/::/g, '@4');
    }

    custom_unescape(s) {
        return s.replace(/@4/g, '::')
            .replace(/@3/g, ';')
            .replace(/@2/g, '/')
            .replace(/@1/g, '=')
            .replace(/@0/g, '@');
    }

    get categories() {
        let ct = document.getElementById('categories');

        let categs = {};
        let temp_key = "";
        let temp_letters = [];
        for (let i in ct.children) {
            let categ = ct.children[i];
            for (let j in categ.children) {
                let child = categ.children[j];
                if (child.tagName !== 'INPUT') {
                    continue;
                }
                let val = child.value;
                if (child.name === 'cat') {
                    if (temp_key !== "") {
                        categs[temp_key] = temp_letters;
                    }
                    temp_letters = [];
                    temp_key = val;
                } else {
                    temp_letters.push(val);
                }
            }
        }
        if (temp_key !== "") {
            categs[temp_key] = temp_letters;
        }
        return categs
    }

    set categories(cats_obj) {
        this.clear_categories();
        let c = document.getElementById('categories');
        let add_button = c.children[0];
        for (let key in cats_obj) {
            let categ_div = add_button.onclick();
            let categ_name_field = categ_div.children[0];
            let letter_add_btn = categ_div.children[1];
            categ_name_field.value = key;
            for (let j in cats_obj[key]) {
                let letter = cats_obj[key][j];
                let letter_field = letter_add_btn.onclick();
                letter_field.value = letter;
            }
        }
    }

    resolve_first_question_mark(str_list) {
        let first_qmark_i = null;
        for (let i in str_list) {
            let s = str_list[i];
            if (s.endsWith('?') && first_qmark_i === null) {
                first_qmark_i = i;
            }
        }
        if (first_qmark_i === null) {
            return [str_list]
        }
        let before = str_list.slice(0, first_qmark_i);
        let after = str_list.slice(first_qmark_i + 1);
        let optional = str_list[first_qmark_i];
        // remove the ? at the end
        let s = optional.substring(0, optional.length - 1);
        let a = before.concat([s].concat(after));
        let b = before.concat(after);
        return [a, b];
    }

    list_has_optionals(str_list) {
        let r = this.resolve_first_question_mark(str_list);
        return r.length == 2;
    }

    pop_non_optionals(str_list_list) {
        let have_optionals = [];
        let dont_have_optionals = [];
        for (let i in str_list_list) {
            let str_list = str_list_list[i];
            if (this.list_has_optionals(str_list)) {
                have_optionals.push(str_list);
            } else {
                dont_have_optionals.push(str_list);
            }
        }
        return {true: have_optionals, false: dont_have_optionals}
    }

    get syllables() {
        let sl = document.getElementById('syllables');

        let syls = [];
        let temp_cats = [];
        for (let i in sl.children) {
            let syl = sl.children[i];
            if (syl.tagName !== 'DIV') {
                continue;
            }
            for (let j in syl.children) {
                let child = syl.children[j];
                if (child.tagName !== 'INPUT') {
                    continue;
                }
                let val = child.value;
                temp_cats.push(val);
            }
            syls.push(temp_cats);
            temp_cats = [];
        }
        // // Question Mark resolving
        // let res = [];
        // for (let i in syls) {
        //     let syl = syls[i];
        //     let new_syls = [syl];
        //     let has_optionals = true;
        //     while(has_optionals) {
        //         has_optionals = false;
        //         let r = this.pop_non_optionals(new_syls);
        //         // TODO: implement
        //     }
        // }
        return syls;
    }

    set syllables(syls_list) {
        this.clear_syllables();
        let s = document.getElementById('syllables');
        let add_button = s.children[0];
        for (let i in syls_list) {
            let categs = syls_list[i];
            let syl_div = add_button.onclick();
            let syl_add_btn = syl_div.children[1];
            for (let j in categs) {
                let categ = categs[j];
                let categ_field;
                if (j == 0) {
                    categ_field = syl_div.children[0];
                } else {
                    categ_field = syl_add_btn.onclick();
                }
                categ_field.value = categ;
            }
        }
    }

    get syllable_counts_list() {
        let sc = document.getElementById('sylcount');

        let syl_counts = [];
        for (let i in sc.children) {
            let child = sc.children[i];
            if (child.tagName !== "INPUT") {
                continue;
            }
            let val = child.value;
            if (!syl_counts.includes(val)) {
                syl_counts.push(val);
            }
        }
        return syl_counts;
    }

    set syllable_counts_list(sylcounts_list) {
        this.clear_sylcounts();
        let sc = document.getElementById('sylcount');
        let add_button = sc.children[0];
        for (let i in sylcounts_list) {
            let sylcount = sylcounts_list[i];
            let sylcount_field = add_button.onclick();
            sylcount_field.value = sylcount;
        }
    }

    get timeout() {
        return document.getElementById('timeout').value;
    }

    set timeout(v) {
        document.getElementById('timeout').value = v;
    }

    get remove_doubles() {
        // The + converts it to an int
        return +document.getElementById('rem_dbls').checked;
    }

    set remove_doubles(v) {
        document.getElementById('rem_dbls').checked = v;
    }

    get amount() {
        return document.getElementById('amount').value;
    }

    set amount(v) {
        document.getElementById('amount').value = v;
    }

    to_string() {
        let ct = document.getElementById('categories');
        let sl = document.getElementById('syllables');
        let sc = document.getElementById('sylcount');

        let remove_doubles = this.remove_doubles;
        let amount = this.amount;


        let categs = this.categories;
        let categ_str = "";
        for (let key in categs) {
            let cat_name = this.custom_escape(key);
            let cat_list = categs[key];
            let new_cat_list = [];
            for (let i in cat_list) {
                let v = this.custom_escape(cat_list[i]);
                new_cat_list.push(v);
            }
            categ_str += ';' + cat_name + '=' + new_cat_list.join('/');
        }
        categ_str = categ_str.substring(1);

        let syls = this.syllables;
        let syl_str = "";
        for (let i in syls) {
            let syl_list = syls[i];
            let new_syl_list = [];
            for (let j in syl_list) {
                let v = this.custom_escape(syl_list[j]);
                new_syl_list.push(v);
            }
            syl_str += ';' + new_syl_list.join('/');
        }
        syl_str = syl_str.substring(1);


        let syl_count_str = this.syllable_counts_list.join('/');


        let res_list = [categ_str, syl_str, remove_doubles, amount, syl_count_str];
        return res_list.join('::');
    }

    from_string(s) {
        let vals_temp = s.split('::');
        let categ_str = vals_temp[0];
        let syl_str = vals_temp[1];
        let remove_doubles = parseInt(vals_temp[2]);
        let amount = parseInt(vals_temp[3]);
        let syl_count_str = vals_temp[4];

        this.remove_doubles = remove_doubles;
        this.amount = amount;

        let categs = {};
        let categ_strs = categ_str.split(';');
        for (let i in categ_strs) {
            let categ_s = categ_strs[i];
            let categ_temp = categ_s.split('=');
            let categ_name = this.custom_unescape(categ_temp[0]);
            let categ_items = categ_temp[1].split('/');
            categ_items.forEach((elt, i, arr) => {arr[i] = this.custom_unescape(elt)});
            categs[categ_name] = categ_items;
        }
        this.categories = categs;

        let syls = [];
        let syl_strs = syl_str.split(';');
        for (let i in syl_strs) {
            let syl_s = syl_strs[i];
            let syl_items = syl_s.split('/');
            syl_items.forEach((elt, i, arr) => {arr[i] = this.custom_unescape(elt)});
            syls.push(syl_items);
        }
        this.syllables = syls;

        let syl_counts = syl_count_str.split('/');
        this.syllable_counts_list = syl_counts;
    }
}