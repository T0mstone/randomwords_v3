class Random {
    static randint(min, max) {
        let r = Math.random();
        let f = min + (r * (max - min));
        let i = Math.round(f);
        return i;
    }

    static choice(list) {
        let i = Random.randint(0, list.length - 1);
        return list[i];
    }
}

class Helper {
    static combinations(list, n) {
        let res = [""];
        for (let i_n = 0; i_n < n; i_n++) {
            let new_res = [];
            for (let r in res) {
                let res_item = res[r];
                let temp_res = [];
                for (let i in list) {
                    let s = list[i];
                    temp_res.push(res_item + s);
                }
                new_res = new_res.concat(temp_res);
            }
            res = new_res;
        }
        return res;
    }
}

class RandomwordsV3 {
    constructor(categories, syllables, rewrite_rules, recursion_limit, will_gen_all) {
        this.categories = categories;
        this.syllables = syllables;
        this.rewrite_rules = rewrite_rules;
        this.categ_recursion_limit = recursion_limit;
        this.will_gen_all = will_gen_all;

        this.categories = this.resolve_categories();
    }

    is_category(key) {
        return this.categories[key] !== undefined;
    }

    resolve_categories() {
        let new_categories = {};
        for (let categ in this.categories) {
            new_categories[categ] = this.resolve_category(categ);
        }
        return new_categories;
    }

    resolve_category(cat_name, curr_rec_level) {
        if (curr_rec_level === undefined) {
            curr_rec_level = 0;
        }
        let new_letters = [];

        let letters = this.get_categ(cat_name);

        if (list_eq(letters, [cat_name]) || curr_rec_level >= this.categ_recursion_limit) {
            return letters;
        }

        for (let i in letters) {
            let letter = letters[i];
            if (this.is_category(letter)) {
                let cat_letters = this.resolve_category(letter, curr_rec_level + 1);
                new_letters = new_letters.concat(cat_letters);
            } else {
                new_letters.push(letter);
            }
        }
        return new_letters
    }

    from_strings(categories_string, category_sep, syllables_string, syllable_sep) {
        let categ_strs = categories_string.split('\n');
        this.categories = {};
        for (let i in categ_strs) {
            let spl = categ_strs[i].split('=');
            let key = spl[0];
            let val = spl[1];
            this.categories[key] = val.split(category_sep);
        }
        this.syllables = [];
        let syllab_strs = syllables_string.split('\n');
        for (let i in syllab_strs) {
            this.syllables.push(syllab_strs[i].split(category_sep));
        }
    }

    get_categ(key) {
        if (this.categories[key] !== undefined) {
            // Then it's not a category but a letter
            return this.categories[key];
        }
        return [key];
    }

    gen_letter(category) {
        let letters = this.get_categ(category);
        return Random.choice(letters);
    }

    gen_syllable(syllable_list) {
        let res = "";
        for (let i in syllable_list) {
            res += this.gen_letter(syllable_list[i]);
        }
        return res;
    }

    all_possible_syllable_syllables(syllable_list) {
        let res = [""];
        for (let i in syllable_list) {
            let categ = syllable_list[i];
            let letters = this.get_categ(categ);
            let tempres = [];
            for (let r in res) {
                let curr_tempres = [];
                let wordpart = res[r];
                for (let j in letters) {
                    let letter = letters[j];
                    let curr_wordpart = wordpart + letter;
                    curr_tempres.push(curr_wordpart);
                }
                tempres = tempres.concat(curr_tempres);
            }
            res = tempres;
        }
        return res;
    }

    all_possible_syllables() {
        let res = [];
        for (let i in this.syllables) {
            let syllab_list = this.syllables[i];
            let syls = this.all_possible_syllable_syllables(syllab_list);
            res = res.concat(syls);
        }
        return res;
    }

    gen_random_syllable() {
        return this.gen_syllable(Random.choice(this.syllables));
    }

    gen_word(syllable_count) {
        let res = "";
        for (let i = 0; i < syllable_count; i++) {
            res += this.gen_random_syllable();
        }
        return this.rewrite_word(res);
    }

    rewrite_word(word) {
        for (let i in this.rewrite_rules) {
            let pat = this.rewrite_rules[i][0]
            let rep = this.rewrite_rules[i][1];
            word = ">" + word + "<";
            word = word.replace(pat, rep);
            word = word.replace(/^>|<$/g, '');
        }
        return word;
    }

    all_possible_words_sylcount(syllable_count) {
        let syllabs = this.all_possible_syllables();
        return Helper.combinations(syllabs, syllable_count);
    }

    gen_word_random_sylcount(syllable_counts_list) {
        return this.gen_word(Random.choice(syllable_counts_list));
    }

    maximum_possible_different_syllables() {
        let res = 0;
        for (let i in this.syllables) {
            let syllable = this.syllables[i];
            let tempres = 1;
            for (let j in syllable) {
                let categ = syllable[j];
                let categ_len = this.get_categ(categ).length;
                tempres *= categ_len;
            }
            res += tempres;
        }
        return res
    }

    maximum_possible_words_sylcount(syllable_count) {
        let maxsyl = this.maximum_possible_different_syllables();
        return Math.pow(maxsyl, syllable_count);
    }

    maximum_possible_words(syllable_counts_list) {
        let res = 0;
        for (let i in syllable_counts_list) {
            let sylcount = syllable_counts_list[i];
            res += this.maximum_possible_words_sylcount(sylcount);
        }
        return res
    }

    gen_words(amount, syllable_counts_list) {
        console.log("generating", amount, "words...");
        let res = [];
        for (let i = 0; i < amount; i++) {
            res.push(this.gen_word_random_sylcount(syllable_counts_list));
        }
        return res;
    }

    gen_all_words(syllable_counts_list) {
        console.log("Under some circumstances, it is possible that duplicates can occur even here");
        let res = [];
        for (let i in syllable_counts_list) {
            let sc = syllable_counts_list[i];
            res = res.concat(this.all_possible_words_sylcount(sc));
        }
        return res;
    }

    gen_words_without_doubles(amount, syllable_counts_list, timeout_secs) {
        console.log("generating", amount, "words (without doubles)...");
        let max_amount = this.maximum_possible_words(syllable_counts_list);
        if (amount >= max_amount && this.will_gen_all) {
            console.log("amount (" + amount + ") equals or exceeds the maximum possible words (" + max_amount + "), generating all possible words...");
            return this.gen_all_words(syllable_counts_list);
        }
        let start_ms = new Date().getTime();
        let res = [];
        for (let i = 0; i < amount; i++) {
            let word = this.gen_word_random_sylcount(syllable_counts_list);
            let curr_ms = new Date().getTime();
            let delta_ms = curr_ms - start_ms;
            let delta_s = delta_ms / 1000;
            if (delta_s >= timeout_secs) {
                alert("Request taking too long (" + delta_s + "s)! generated " + res.length + " words.");
                return res;
            } else if (res.includes(word)) {
                i--;
            } else {
                res.push(word);
            }
        }
        return res;
    }
}